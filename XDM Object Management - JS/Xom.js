'use strict';
function deepFreeze(o) {
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach(function(prop) {
        if (o.hasOwnProperty(prop) &&
            o[prop] !== null &&
            (typeof o[prop] === "object" || typeof o[prop] === "function") &&
            !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop]);
        }
    });
    return o;
};

class Xom{
    
    /**
     * 
     * @param {object} object 
     * @param {string} tenant 
     * @param {string} defaultValue 
     */
    constructor(object,tenant=undefined,defaultValue=undefined) {
        this.data = {}
        this.defaultValue = defaultValue
        if(tenant != undefined){
            this.data = {
                tenant : {}
            }
        }
        else if (typeof(object) == 'object' && (object instanceof Xom) == false){
            this.data = Object.assign({},object)
        }
        else if (typeof(object) == 'object' && (object instanceof Xom) == true){
            this.data = Object.assign({},object.data)
        }
    }

    /** Getter of the Xom class instanciation.
     *  
     * @param {string} path can be empty to return the whole object or a specific path such as "tenant.firstname"
     * @returns {object|str} 
     */
    get(path){
        if(typeof(path) == "undefined" || path == ""){
            return this.data
        }
        else if(typeof(path) == "string"){
            var pathSplit = path.split(".")
            var value = this.data
            for (var i = 0; i < pathSplit.length && value != undefined; i++) { // Traverse until found or undefined
                if (Array.isArray(value) && Math.abs(parseInt(pathSplit[i]))<=value.length) { //If parent is array and path is in the index
                    if(parseInt(pathSplit[i])<0){ /** Negative number */
                        value = value[value.length - Math.abs(parseInt(pathSplit[i]))];
                    }
                    else{
                        value = value[parseInt(pathSplit[i])];
                    }
                    console.log(value)
                } 
                else if(Array.isArray(value) && Math.abs(parseInt(pathSplit[i]))>value.length){ // trying to access above # of elements
                    value = this.defaultValue || undefined
                }
                else {
                    value = value[pathSplit[i]];
                }
            }
            return value || this.defaultValue || undefined
        }
    }

    /**
     * Assign a value to a path, creating a path if necessary
     * 
     * @param {string} path 
     * @param {object|string} value
     */
    assign(path, value){
        if(typeof path != "undefined" && path != "" && typeof path == "string"){
            var pathSplit = path.split('.');
            /* define path and create it if required */
            var xom = this.data
            for (var i=0;i<pathSplit.length && xom != undefined;i++){ // Traverse a create if necessary
                if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == true) { //If value is a string
                    console.log('string')
                    if(Object(xom).hasOwnProperty(pathSplit[i])){// if path present
                        if (i == pathSplit.length -1){ // if it is the last element
                            if(Array.isArray(xom[pathSplit[i]])){ // if it is an array
                                xom[pathSplit[i]].push(value)
                            }
                            else{
                                xom[pathSplit[i]] = value
                            }
                            
                        }
                        else{
                            xom = xom[pathSplit[i]]
                        }
                    }
                    else{// if path not present
                        if (i == pathSplit.length -1){ /** if last element */
                            xom[pathSplit[i]] = value
                        }
                        else{
                            if(isNaN(pathSplit[i+1])){ /* next element is part of object */
                                xom[pathSplit[i]] = {} /** create the path */
                            }
                            else{/* next element is part of an array */
                                xom[pathSplit[i]] = [] /** create the path */
                            }
                            xom = xom[pathSplit[i]] /** assign the new path*/
                        }
                    }
                } 
                else if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == false) { //If value is a number
                    console.log('number')
                    if(Array.isArray(xom) && Math.abs(pathSplit[i]) < xom.length){ /* Array contain enough elements */
                        if (i == pathSplit.length -1){
                            xom[pathSplit[i]].push(value)
                        }
                        else{
                            xom = xom[pathSplit[i]]
                        }
                    }
                    else if(Array.isArray(xom) && i > xom.length){ /* Array do not contain enough elements - creating one additional */
                        if (i == pathSplit.length -1){
                            xom.push(value);
                        }
                        else{
                            xom.push({});
                            xom = xom[xom.length-1];
                        }
                    }
                    
                }
            }
        }
        else if (typeof path == "object" ){
            this.data = Object.assign(this.data,path)
            var xom = this.data
        }
        return xom
    }

    /** the merge method will take a path, and an existing object 
     * @param {string} path where you want to merge the object
     * @param {object} object the object to merge
    */
    merge(object,path){
        if(typeof(path) == 'undefined' || path == ""){
            this.data = Object.assign(this.data,object);
            return this.data
        }
        else{
            var pathSplit = path.split(".");
            var value = this.data;
            for (var i = 0; i < pathSplit.length && value != undefined; i++) { // Traverse until found or undefined
                if (Array.isArray(value) && Math.abs(parseInt(pathSplit[i]))<=value.length) { //If parent is array and path is in the index
                    if(parseInt(pathSplit[i])<0){ /** Negative number */
                        value = value[value.length - Math.abs(parseInt(pathSplit[i]))];
                    }
                    else{
                        value = value[parseInt(pathSplit[i])];
                    }
                    console.log(value)
                } 
                else if(Array.isArray(value) && Math.abs(parseInt(pathSplit[i]))>value.length){ // trying to access above # of elements
                    value = this.defaultValue || undefined
                }
                else {
                    value = value[pathSplit[i]];
                }
            }
            if(typeof(value) != 'undefined' || value != this.defaultValue){
                if (Array.isArray(value) && Array.isArray(object)){
                    object.forEach(function(element){
                        value.push(element);
                    })
                }
                else{
                    var newValue = Object.assign(value,object)
                    this.data = this.assign(path,newValue)
                }
                return this.data
            }
        }

    }

    /** Remove the value from the specific path.
     *  If path is not provided, clear the data.
     * 
     * @param {string} path
     */
    remove(path){
        if(path == "" || typeof path == "undefined"){
            this.clear()
        }
        else{
            var pathSplit = path.split('.');
        /* define path and create it if required */
        var xom = this.data
        for (var i=0;i<pathSplit.length && xom != undefined;i++){ // Traverse a create if necessary
            if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == true) { //If value is a string
                console.log('string');
                if(Object(xom).hasOwnProperty(pathSplit[i])){// if path present
                    if (i == pathSplit.length -1){
                        xom[pathSplit[i]] = ""
                    }
                    else{
                        xom = xom[pathSplit[i]]
                    }
                }
                else{// if path not present
                    xom = ""
                    return this.data
                }
            } 
            else if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == false) { //If value is a number
                console.log('number');
                if(Array.isArray(xom) && Math.abs(pathSplit[i]) < xom.length){ /* Array contain enough elements */
                    if (i == pathSplit.length -1){ /* if the element is the last */
                        xom.splice(pathSplit[i], 1);
                        return this.data
                    }
                    else{ 
                        xom = xom[pathSplit[i]]
                    }
                }
                else{ /* Array do not contain enough elements */
                    return this.data
                }
                
            }
        }

        }

    }

    clear(){
        this.data = {
        }
    }

    /** clear the object but set a template following the object passed.
     * 
     * @param {object} object if you wish to pass an object to be used as template for start-over.
     */
    partialClear(object){
        this.data = {}
        if(typeof object == 'str'){
            this.data = {
                object:{}
            }
        }
        else if(typeof object == 'object'){
            this.data = object
        }

    }

}