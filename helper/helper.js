const hbs = require('nodemailer-express-handlebars');
const nodemailer = require("nodemailer");
const path = require("path");
const absolutePath = path.resolve("./public/");
var Users = require.main.require('./models/Users');
var _ = require("underscore");



async function time() {
	return moment().unix();
}
exports.time = time;



async function sendEmail(emailData) { 
	var _Setting = await Setting.find().exec();
	let settings = []
	_.map(_Setting,function(value,key){
	    settings[value.key] = value.value;
	})
	if(settings['MAIL_HOST'] ==""){
		return false;
	}
	let transporter = nodemailer.createTransport({
	        host: settings['MAIL_HOST'],
	       	port: settings['MAIL_PORT'],
	        secure: true,
	        auth: {
	            user: settings['MAIL_USERNAME'],
	            pass: settings['MAIL_PASSWORD'],
	        },
	        logger: false,
	        transactionLog: false, // include SMTP traffic in the logs
	        allowInternalNetworkInterfaces: false
	    },
	    {
	        from: settings['SITE_NAME'] + '<' + settings['MAIL_FROM_ADDRESS']+'>',
	        headers: {
	            'X-Laziness-level': 1000 // just an example header, no need to use this
	        }
	    }
	);

	// point to the template folder
	const handlebarOptions = {
	    viewEngine: {
	        partialsDir: path.resolve('./views/emails/'),
	        defaultLayout: false,
	    },
	    viewPath: path.resolve('./views/emails/'),
	};
	transporter.use('compile', hbs(handlebarOptions))
	return transporter.sendMail(emailData);	
}
exports.sendEmail = sendEmail;