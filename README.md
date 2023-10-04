# Pixview plugin SDK
The Pixview plugin SDK lets you develop your own plugin to view new types of content in Pixview. The SDK sets up communication between your plugin and the Pixview player and provides multiple methods and events.

## Prerequisites
- Node.js 16.14.0 or higher

## Getting started
Run `npm install` to install required dependencies. To help you develop a plugin, this repo offers a small CLI tool that supports a couple of commands. To create a new plugin, run `pixcli new <name>`.

To test your plugins, run `pixcli test` to start a local server. You can then visit `localhost:8080` to view the test environment. This will allow you to open your plugin and load it into an iframe just as it would in the Pixview Player. Values can be set for the parameters as defined in your *manifest.json* and events can be simulated. Your plugin code can also directly be edited from this page. To view your changes, click reload plugin.

### Making a secure API request
The request method lets you safely use secrets in an HTTP request. Instead of using an actual API token as value, you insert a placeholder when making the request. The actual value is inserted later by Pixview.

To configure a secure parameter, set the `secure` option to true. Then, when calling the `request()` method, use the parameter key as placeholder like this:
```
const options = {
	url: "https://api.example.com/",
	type: "GET", 
	headers: {
		Authorization: "Bearer {api-token}"
	},
};
	
client.request(options).then((response) => { 
	console.log(response);
});
```

### Uploading your plugin
When you've sufficiently tested your plugin, run `pixcli package <directory>` to validate and package your plugin into a zip archive. You may also do this manually. Pixview will accept HTML, JavaScript, and image files. Make sure you validate your plugin using `pixcli validate <directory>` before uploading. The contents of your zip file should look something like this:

- index.html
- sdk.js
- manifest.json
- another_script.js
- cute_dog.jpg

## Manifest
Each plugin must define a *manifest.json* file that describes the plugin. A template will be available in the src folder. A plugin can be configured as follows:
```
{
	"name": "My plugin",
	"description": "A new empty plugin",
	"version": "0.1",
	"parameters": [
		{
		"name": "Text Parameter",
		"key": "text_param",
		"description": "This parameter accepts a text value",
		"type": "text",
		"optional": false
		}
	]
}
```

### name: string
The name of your plugin.

### description: string
A short description of the functionality of your plugin.

### version: string
Version number used to update your plugin.

### parameters: array
Defines the list of parameters your plugin accepts as input by a user. The following properties are available:

- **name** Name of parameter shown in the portal.
- **key** Unique key used to identify parameter.
- **description** Short description of parameter.
- **type** Datatype of parameter. Options are:
	- *text* - JSON string type, shown as text input in portal.
	- *number* - JSON number type, show as number input in portal.
	- *checkbox* - JSON boolean type, shown as checkbox in portal.
	- *password* - JSON string type, shown as password input in portal.
	- *multiline* - JSON string type, shown as textarea in portal.
- **optional** Indicates whether or not parameter can be ignored by a user.
- **secure** If set to true, value will be encrypted. Used for API tokens.

## SDK API
A plugin is essentially an *index.html* file containing different HTML elements and JavaScript. An example will be available in the src folder. To allow the plugin to run, *index.html* will have to import the *pixview-plugin-sdk.js* file. The SDK will facilitate the communication between your plugin and the Pixview Player. After initializing the client, the following methods are available:

### getParams()
Requests list of parameters as defined by *manifest.json*.

#### *Return value*
Returns an array of parameters with user inputted values.

```
const client = PIXClient.init();

client.getParams().then((response) => {
	console.log(response);
	// {"text_param": "Hello World!"}
})
```

### request(options)
Makes an HTTP request.

#### *Arguments*
- `options` an object containing one or more of the following properties:
	- url
    - method
    - body
	- headers
	
#### *Return value*
Returns response body

```
const options = { 
	url: "https://api.example.com",
	type: "GET"
};
	
client.request(options).then((response) => {
	console.log(response);
});
```

### client.on(name, handler)
Allows you to add handlers to events. Currently only the `active` event is available, which returns true or false when the plugin is active or inactive respectively.

#### *Arguments*
- `name` name of the event
- `handler` attached function

```
client.on('active', function(e) {
	// do whatever
})
```

### saveToLocalStorage(data)
Saves data to localStorage. Keep in mind values stored in localStorage are always strings.  

#### *Arguments*
- `data` string saved in localStorage

```
client.saveToLocalStorage('Hello World!').then(() => {
    	console.log('Saved in storage');
});
```

### getFromLocalStorage()
Request saved plugin data in localStorage

```
client.getFromLocalStorage().then((response) => {
    	console.log(response);
    	// 'Hello World!'
});
```

### getPlayer()
Get information about device where plugin is currently being displayed.
```
client.getPlayer().then((response) => {
    	console.log(response);
    	// {
    	   location: Object {
    	   	id: 1,
    	    	name: "XIP",
    	   	latitude: "52.2216067616560050", … 
    	    },
    	    name: "Test Player",
    	    status: "active",
    	    }
});
```

#### *Return value*
Returns a Player object.







