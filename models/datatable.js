module.exports = exports = dataTablesPlugin

function dataTablesPlugin (schema, options) {
    options = options || {}
    var totalKey = options.totalKey || 'total'
    var dataKey = options.dataKey || 'data'
    var pagination = options.pagination || 'pagination'
    var formatters = options.formatters || {}

    schema.statics.dataTables = function (params, callback) {
        if (typeof params === 'function') {
            callback = params
            params = {}
        }

        callback = callback || function () {}

        var thisSchema = this
        var limit = parseInt(params.limit, 10)
        var skip = parseInt(params.skip, 10)
        var select = params.select || {}
        var find = params.find || {}
        var and = params.and || {}
        var sort = params.sort || {}
        var search = params.search || {}
        var order = params.order || [];
        var columns = params.columns || [];
        var formatter = params.formatter
      
        var size = Object.keys(and).length;
        if (size > 0) {        
            Object.keys(and).forEach(key => {
                if (!find.$and) {
                    find.$and = []
                }
                var obj = {}
                obj[key] = and[key]
                find.$and.push(obj)
            });      
        }

        if (search && search.value && search.fields && search.fields.length) {
          var searchQuery = {
            '$regex': search.value,
            '$options': 'i'
          }

            if (search.fields.length == 1) {
                find[search.fields[0]] = searchQuery
            }else if(search.fields.length > 1) {
            if (!find.$or) {
                find.$or = []
            }
            search.fields.forEach(function (el){
                var obj = {}
                obj[el] = searchQuery   
                find.$or.push(obj)
            })
          }
        }

        if (order && columns) {
            const sortByOrder = order.reduce((memo, ordr) => {
                const column = columns[ordr.column];
                memo[column.data] = ordr.dir === 'asc' ? 1 :  -1;
                return memo;
            }, {});

            if (Object.keys(sortByOrder).length) {
                sort = sortByOrder;
            }
        }
    
        var query = thisSchema
            .find(find)
            .select(select)
            .skip(skip)
            .limit(limit)
            .sort(sort)

        if (params.populate) {
            query.populate(params.populate)
        }

        if (params.return_query) {
           return [query,thisSchema,find];
        }

        return new Promise((resolve, reject) => {
            // validate formatter
            // formatters can be a function or a string from a formatter defined on options
            if (formatter && !(
                typeof formatter === 'function' ||
                (typeof formatter === 'string' && formatters[formatter])
                )){
                    return reject(new Error('Invalid formatter'))
            }

            Promise
                .all([query.exec(), thisSchema.countDocuments(find)])
                .then(function (results) {
                    //console.log("results")
                    //console.log(results)
                    var response = {}
                    response[totalKey] = results[1]

                    if (typeof formatter === 'string' && formatters[formatter]) {
                        response[dataKey] = results[0].map(formatters[formatter])
                    } else if (typeof formatter === 'function') {
                        response[dataKey] = results[0].map(formatter)
                    } else {
                        response[dataKey] = results[0]
                    }
                    let page = Math.ceil((skip + 1) / limit);
                    const pagination_ = {                
                        total: results[1],
                        limit: limit,
                        page: page,
                        prevPage: -1,
                        nextPage: -1,
                        hasPrevPage: false,
                        hasNextPage: false,
                    }

                    const totalPages = limit > 0 ? Math.ceil(results[1] / limit) || 1 : null;
                    pagination_.totalPages = totalPages;
                    pagination_.pagingCounter = (page - 1) * limit + 1;

                    // Set prev page
                    if (page > 1) {
                      pagination_.hasPrevPage = true;
                      pagination_.prevPage = page - 1;
                    } else if (page == 1 && skip !== 0) {
                      pagination_.hasPrevPage = true;
                      pagination_.prevPage = 1;
                    }

                    // Set next page
                    if (page < totalPages) {
                      pagination_.hasNextPage = true;
                      pagination_.nextPage = page + 1;
                    }

                    if (limit == 0) {
                      pagination_.limit = 0;
                      pagination_.totalPages = 1;
                      pagination_.page = 1;
                      pagination_.pagingCounter = 1;
                    }
                    response[pagination] = pagination_;

                    resolve(response)
                    callback(null, response)
                })
            .catch(function (err) {
                reject(err)
                callback(err)
            })
        })
    }
}