<a name="module_api-cli"></a>

## api-cli
Command line interface for the api.


* [api-cli](#module_api-cli)
    * [~printUsage()](#module_api-cli..printUsage)
    * [~hasSameKeys(a, b)](#module_api-cli..hasSameKeys) ⇒ <code>bool</code>
    * [~run()](#module_api-cli..run)
    * [~useConfigurationFile()](#module_api-cli..useConfigurationFile)
    * [~useArguments()](#module_api-cli..useArguments)

<a name="module_api-cli..printUsage"></a>

### api-cli~printUsage()
Prints the usage chart and ends the program.

**Kind**: inner method of [<code>api-cli</code>](#module_api-cli)  
<a name="module_api-cli..hasSameKeys"></a>

### api-cli~hasSameKeys(a, b) ⇒ <code>bool</code>
Compare two object's key structures.

**Kind**: inner method of [<code>api-cli</code>](#module_api-cli)  
**Returns**: <code>bool</code> - Whether the objects have the same keys  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>object</code> | First object to compare |
| b | <code>object</code> | Second object to compare |

<a name="module_api-cli..run"></a>

### api-cli~run()
Run the generation scripts and start the server.

**Kind**: inner method of [<code>api-cli</code>](#module_api-cli)  
<a name="module_api-cli..useConfigurationFile"></a>

### api-cli~useConfigurationFile()
Sets the configuration object by reading an input file.

**Kind**: inner method of [<code>api-cli</code>](#module_api-cli)  
<a name="module_api-cli..useArguments"></a>

### api-cli~useArguments()
Sets the configuration object by mapping the command line arguments.

**Kind**: inner method of [<code>api-cli</code>](#module_api-cli)  
