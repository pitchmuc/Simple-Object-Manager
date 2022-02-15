'use strict';
class Som{
    /**
     * 
     * @param {object} object 
     * @param {string} defaultValue 
     */
    constructor(object,defaultValue=undefined) {
        this.data = {};
        this.version = '0.0.1';
        this.defaultValue = defaultValue;
        if (typeof(object) == 'object' && (object instanceof Som) == false){
            if(Array.isArray(object) && object.length > 0){
                object.forEach(function(element){
                    this.data = Object.assign(this.data,element)
                })

            }
            else{
                this.data = Object.assign({},object)
            }
        }
        else if (typeof(object) == 'object' && (object instanceof Som) == true){
            this.data = Object.assign({},object.data)
        }
    }

    /** Getter of the Xom class instanciation.
     *  
     * @param {string} path can be empty to return the whole object or a specific path such as "tenant.firstname"
     * @returns {object|string} 
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
        if (typeof value == "undefined"){
            value = {}
        }
        if(typeof path != "undefined" && path != "" && typeof path == "string"){
            var pathSplit = path.split('.');
            /* define path and create it if required */
            var xom = this.data
            for (var i=0;i<pathSplit.length && xom != undefined;i++){ // Traverse a create if necessary
                if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == true) { //If value is a string
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
                            if(typeof xom[pathSplit[i]] == 'string'){
                                xom[pathSplit[i]] = {}
                            }
                            xom = xom[pathSplit[i]]
                        }
                    }
                    else{// if path not present
                        if (i == pathSplit.length -1){ /** if last element */
                            if(typeof xom !='object'){ /** if previous element is not an object */
                                return undefined
                            }
                            else{
                                xom[pathSplit[i]] = value
                            }
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
                    if(Array.isArray(xom) && Math.abs(pathSplit[i]) < xom.length){ /* Array contain enough elements */
                        if (i == pathSplit.length -1){ /** last element */
                            xom[pathSplit[i]] = value
                        }
                        else{
                            xom = xom[pathSplit[i]]
                        }
                    }
                    else if(Array.isArray(xom) && pathSplit[i] >= xom.length){ /* Array do not contain enough elements - creating one additional */
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
        }
        return this.data
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
     *  If you provide true to the "key" parameter, it will delete the key itself.
     * 
     * @param {string} path
     * @param {boolean} key
     */
    remove(path,key){
        if (typeof key == "undefined"){
            key = false;
        }
        if(path == "" || typeof path == "undefined"){
            this.clear()
        }
        else{
            var pathSplit = path.split('.');
        /* define path and create it if required */
        var xom = this.data
        for (var i=0;i<pathSplit.length && xom != undefined;i++){ // Traverse a create if necessary
            if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == true) { //If value is a string
                if(Object(xom).hasOwnProperty(pathSplit[i])){// if path present
                    if (i == pathSplit.length -1){/** last element */
                        if(typeof xom[pathSplit[i]] == "object"){
                            delete xom[pathSplit[i]]
                        }else{
                            if(key){
                                delete xom[pathSplit[i]]
                            }
                            else{
                                xom[pathSplit[i]] = undefined
                            }
                            
                        }
                    }
                    else{
                        xom = xom[pathSplit[i]]
                    }
                }
                else{// if path not present
                    return this.data
                }
            } 
            else if (typeof(pathSplit[i]) == 'string' && isNaN(pathSplit[i]) == false) { //If value is a number
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
}