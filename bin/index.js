#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const path = require('path');
const fs = require('fs');

const archiver = require('archiver');

const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
	type: "object",
	properties: {
		name: {type: "string"},
		description: {type: "string"},
		version: {type: "string"},
		parameters: {type: "array",
		items: {
			type: "object",
			properties: {
				name: {type: "string"},
				key: {type: "string"},
				type: {type: "string",
				enum: ['text', 'number', 'checkbox', 'password', 'multiline']},
				description: {type: "string"},
				optional: {type: "boolean"},
				secure: {type: "boolean"}
			},
			required: ["name", "key", "type", "description", "optional"],
			additionalProperties: false
		}
	}
},
required: ["name", "description", "version"],
additionalProperties: false
}

const validate = ajv.compile(schema)

program
.name('pixcli')
.description('Command line tool to help you develop plugins.')
.version('0.0.1');

program.command('test')
.description('Start the local test environment.')
.action(() => {
	var spawn = require('child_process').spawn;
	spawn('npm start', { stdio: 'inherit', shell: true});
});

program.command('new')
.description('Create a new plugin.')
.argument('<name>', 'name of your plugin')
.action((str) => {
	try {
		if (!fs.existsSync(str)) {
			fs.mkdirSync(str);
			fs.copyFileSync(__dirname+'/pixview-plugin-sdk.js', path.join(__dirname, '..', str, 'pixview-plugin-sdk.js'));
			fs.copyFileSync(__dirname+'/index.html', path.join(__dirname, '..', str, 'index.html'));
			fs.copyFileSync(__dirname+'/manifest.json', path.join(__dirname, '..', str, 'manifest.json'));
			console.log('Created new plugin in directory: ' + str);
		}
	} catch (err) {
		console.error('Plugin directory already exists!');
	}
});

program.command('package')
.description('Validate and package your plugin.')
.argument('<directory>', 'directory of your plugin')
.action((str) => {
	if (fs.existsSync(path.join(__dirname, '..', str))) {
		try {
			const file = fs.readFileSync(path.join(__dirname, '..', str, 'manifest.json'), {encoding: 'utf8'})

			const data = JSON.parse(file);
			const valid = validate(data)
			if (!valid){ 
				console.log(validate.errors)
			} else {
				const name = str.replace(/\//g, '');
				const output = fs.createWriteStream(path.join(__dirname, '..', name + '.zip'));
				const archive = archiver('zip', {
					zlib: { level: 9 }
				});
				archive.pipe(output);
				archive.directory(str, false);
				archive.finalize();
				console.log('Packaged plugin as ' + name + '.zip');
			}
		} catch(err) {
			console.error(err);
		}
	} else {
		console.log('Plugin does not exist.');
	}
});

program.command('validate')
.description('Validate your plugin.')
.argument('<directory>', 'directory of your plugin')
.action((str) => {
	if (fs.existsSync(path.join(__dirname, '..', str))) {
		try {
			const file = fs.readFileSync(path.join(__dirname, '..', str, 'manifest.json'), {encoding: 'utf8'})

			const data = JSON.parse(file);
			const valid = validate(data)
			if (!valid){ 
				console.log(validate.errors)
			} else {
				console.log('Manifest is valid.');
			}
		} catch(err) {
			console.error(err);
		}
	} else {
		console.log('Plugin does not exist.');
	}
});

program.parse();