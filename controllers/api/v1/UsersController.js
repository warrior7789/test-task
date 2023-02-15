var Request = require("request");
var Users = require('../../../models/Users');
var TasksModel = require('../../../models/task');
const controller = 'Users';
const module_name = 'Users';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helper = require("../../../helper/helper");
const jwt = require('jsonwebtoken');
const isEmpty = require(rootpath + "/validation/is-empty");
const path = require("path");
const fs = require('fs');
const absolutePath = path.resolve("./public/");

//http://localhost:8086/api/v1/sign-up
async function Signup(req, res) {
    console.log("here");
    let data = {};
    try {
        const { email, password } = req.body;
        if(isEmpty(email)){
            return res.status(400).json({
                status:false,
                message:"Please enter Email id"
            });            
        }
        if(isEmpty(password)){
            return res.status(400).json({
                status:false,
                message:"Please enter Password"
            });            
        }
        let User = await Users.findOne({email:email})
        if(!isEmpty(User)){
            return res.status(400).json({
                status:false,
                message:"Email Id already exist"
            });
        }
        
        let salt = bcrypt.genSaltSync(saltRounds);
        let new_password = bcrypt.hashSync(password, salt);
        let new_user = await new Users({
            email:email,
            password:new_password
        }).save()        
        return res.status(200).json({
            status:true,
            message:"Signup succesfully"
        });
        
       
    } catch (err) {        
        return res.status(200).json(err);
    }

};
exports.Signup = Signup;

//http://localhost:8086/api/v1/sign-up
async function Login(req, res) {
    let data = {};
    try {
        const { email, password } = req.body;
        if(isEmpty(email)){
            return res.status(400).json({
                status:false,
                message:"Please enter Email id"
            });            
        }
        if(isEmpty(password)){
            return res.status(400).json({
                status:false,
                message:"Please enter Password"
            });            
        }
        let User = await Users.findOne({email:email})
        if (User && bcrypt.compareSync(password, User.password)) { 
                
                const token = await jwt.sign({
                    user_id: User._id
                }, process.env.TOKEN_KEY, {
                    //expiresIn: "30s"
                });  

                return res.status(200).json({
                    status:true,
                    token:token,
                    user:User,
                    message:"Login succesfully"
                });

        }else{
            return res.status(400).json({
                status:false,
                message:"Invalid Credentials"
            });  
        }

           
        return res.status(200).json({
            status:true,
            message:"Signup succesfully"
        });
        
       
    } catch (err) {        
        return res.status(200).json(err);
    }

};
exports.Login = Login;

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjNlYjdiYmRiMmMyNzY0YWUwNzc2M2IzIiwiaWF0IjoxNjc2Mzc3OTE0fQ.kKORXYN-55UZqhEhEkD2ef7aOYPDYFzCoHDTtKITm5Y"
async function MyAccount(req, res) {
    let data = {};
    try {        
        let User = await Users.findOne({_id:req.user.user_id})
        if (User){
            return res.status(200).json({
                status:false,
                user:User,
                message:"Login succesfully"
            });
        }else{
            return res.status(400).json({
                status:false,
                message:"Invalid Credentials"
            });  
        }           
        return res.status(200).json({
            status:true,
            message:"Signup succesfully"
        });
    } catch (err) {        
        return res.status(200).json(err);
    }

};
exports.MyAccount = MyAccount;

async function AddTask(req, res){
    let data = {};
    try {
        let User = await Users.findOne({_id:req.user.user_id})
        const { task, status,date } = req.body;
        

        //TasksModel
        if(isEmpty(task)){
            return res.status(400).json({
                status:false,
                message:"Task Required field"
            });            
        }
        if(isEmpty(status)){
            return res.status(400).json({
                status:false,
                message:"status required"
            });            
        }
        if(isEmpty(date)){
            return res.status(400).json({
                status:false,
                message:"Date required"
            });            
        }

        let NewTask = new TasksModel({
            task : task,
            status : status,
            date : date,
            user:User
        }).save()
        
        return res.status(200).json({
            status:true,
            message:"Task added succesfully"
        });
    } catch (err) {        
        return res.status(200).json(err);
    }

}
exports.AddTask = AddTask;

async function ListTask(req, res){
    try {
        var i=1;
        let limit = 10
        if(req.body.limit){
            limit = req.body.limit
        }
        let page = 1
        if(req.body.page){
            page = req.body.page
            //offset = 0
        }
        const offset = (page - 1) * limit;

        TasksModel.dataTables({
            limit: limit,
            skip: offset,
            find:{ user: req.user.user_id},
            sort: { order: 1 },
            formatter: function (table) {                
                return {                
                    sr_no: i++,
                    task: table.task,
                    status: table.status,
                    date: table.date,
                    task_id: table._id,
                    order: table.order,
                }
            }
        }).then(function (table) {
            return res.json({
                status:true,
                data:table,
                message:"Fetch succesfully"
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            status:true,
            message:err.message
        });        
    }
}
exports.ListTask = ListTask;


async function UpdateTask(req, res){
    let data = {};
    try {
        let User = await Users.findOne({_id:req.user.user_id})
        const { task, status,date} = req.body;
        let task_id = req.params.task_id        
        
        /*if(isEmpty(task)){
            return res.status(400).json({
                status:false,
                message:"Task Required field"
            });            
        }
        if(isEmpty(status)){
            return res.status(400).json({
                status:false,
                message:"status required"
            });            
        }
        if(isEmpty(date)){
            return res.status(400).json({
                status:false,
                message:"Date required"
            });            
        }*/
        /*if(isEmpty(task_id)){
            return res.status(400).json({
                status:false,
                message:"Task id required"
            });            
        }*/

        
        let Task = await TasksModel.findOne({
            _id:task_id,
            user:User
        })
        if(!isEmpty(Task)){
            
            if(!isEmpty(Task)){
                Task.task = task
            }
            
            if(!isEmpty(status)){
                Task.status = status
            }

            if(!isEmpty(date)){
                Task.date = date
            }

            await Task.save()
            
            return res.status(200).json({
                status:true,
                message:"Task Update succesfully"
            });

        }else{
            return res.status(200).json({
                status:true,
                message:"Invalid Task id"
            });
        } 
        
    } catch (err) {        
        return res.status(400).json(err);
    }
}
exports.UpdateTask = UpdateTask;

async function DeleteTask(req, res){
    let data = {};
    try {
        let User = await Users.findOne({_id:req.user.user_id})        
        let task_id = req.params.task_id 
        let Task = await TasksModel.findOne({
            _id:task_id,
            user:User
        })
        if(!isEmpty(Task)){ 
            await Task.delete()            
            return res.status(200).json({
                status:true,
                message:"Task Delete succesfully"
            });
        }else{
            return res.status(200).json({
                status:true,
                message:"Invalid Task id"
            });
        }         
    } catch (err) {        
        return res.status(400).json(err);
    }
}
exports.DeleteTask = DeleteTask;


async function SortTask(req, res){
    let data = {};
    try {

        const { task_id, order} = req.body;
        if(isEmpty(order)){
            return res.status(400).json({
                status:false,
                message:"order Required field"
            });            
        }
        let User = await Users.findOne({_id:req.user.user_id})        
        
        let Task = await TasksModel.findOne({
            _id:task_id,
            user:User
        })

        if(!isEmpty(Task)){ 
            Task.order = order  
            Task.save()          
            return res.status(200).json({
                status:true,
                message:"Task order update succesfully"
            });
        }else{
            return res.status(200).json({
                status:true,
                message:"Invalid Task id"
            });
        }         
    } catch (err) {        
        return res.status(400).json(err);
    }
}
exports.SortTask = SortTask;