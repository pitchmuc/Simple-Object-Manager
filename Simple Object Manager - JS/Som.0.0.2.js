'use strict';
class Som{
    /**
     * 
     * @param {object} object 
     * @param {string} df 
     */
    constructor(object,df=undefined) {
        this.data = {};
        this.defaultvalue = df;
        if (typeof(object) == 'object' && (object instanceof Som) == false){
            if(Array.isArray(object) && object.length > 0){
                object.forEach(function(element){
                    this.data = Object.assign(this.data,JSON.parse(JSON.stringify(element)));
                })

            }
            else{
                this.data = Object.assign({},JSON.parse(JSON.stringify(object)));
            }
        }
        else if (typeof(object) == 'object' && (object instanceof Som) == true){
            this.data = Object.assign({},JSON.parse(JSON.stringify(object.data)));
        }
    }

    /** Getter of the Xom class instanciation.
     *  
     * @param {string} path can be empty to return the whole object or a specific path such as "tenant.firstname"
     * @returns {object|string} 
     */
    get(path,fallback){
        if(typeof(path) == "undefined" || path == ""){
            return this.data
        }
        else if(typeof(path) == "string"){
            var pS = path.split(".")
            var v = this.data
            for (var i = 0; i < pS.length && v != undefined; i++) { // Traverse until found or undefined
                if (Array.isArray(v) && Math.abs(parseInt(pS[i]))<=v.length) { //If parent is array and path is in the index
                    if(parseInt(pS[i])<0){ /** Negative number */
                        v = v[v.length - Math.abs(parseInt(pS[i]))];
                    }
                    else{
                        v = v[parseInt(pS[i])];
                    }
                } 
                else if(Array.isArray(v) && Math.abs(parseInt(pS[i]))>v.length){ // trying to access above # of elements
                    v = fallback || this.defaultvalue || undefined
                }
                else {
                    v = v[pS[i]];
                }
            }
            return v || fallback || this.defaultvalue || undefined
        }
    }

    /**
     * Assign a v to a path, creating a path if necessary
     * 
     * @param {string} path 
     * @param {object|string} v
     */
    assign(path, v){
        if (typeof v == "undefined"){
            v = {}
        }
        if(typeof path != "undefined" && path != "" && typeof path == "string"){
            var pS = path.split('.');
            /* define path and create it if required */
            var xom = this.data
            for (var i=0;i<pS.length && xom != undefined;i++){ // Traverse a create if necessary
                if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == true) { //If v is a string
                    if(Object(xom).hasOwnProperty(pS[i])){// if path present
                        if (i == pS.length -1){ // if it is the last element
                            if(Array.isArray(xom[pS[i]])){ // if it is an array
                                xom[pS[i]].push(v)
                            }
                            else{
                                xom[pS[i]] = v
                            }
                            
                        }
                        else{
                            if(typeof xom[pS[i]] == 'string'){
                                xom[pS[i]] = {}
                            }
                            xom = xom[pS[i]]
                        }
                    }
                    else{// if path not present
                        if (i == pS.length -1){ /** if last element */
                            if(typeof xom !='object'){ /** if previous element is not an object */
                                return undefined
                            }
                            else{
                                xom[pS[i]] = v
                            }
                        }
                        else{
                            if(isNaN(pS[i+1])){ /* next element is part of object */
                                xom[pS[i]] = {} /** create the path */
                            }
                            else{/* next element is part of an array */
                                xom[pS[i]] = [] /** create the path */
                            }
                            xom = xom[pS[i]] /** assign the new path*/
                        }
                    }
                } 
                else if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == false) { //If v is a number
                    if(Array.isArray(xom) && Math.abs(pS[i]) < xom.length){ /* Array contain enough elements */
                        if (i == pS.length -1){ /** last element */
                            xom[pS[i]] = v
                        }
                        else{
                            xom = xom[pS[i]]
                        }
                    }
                    else if(Array.isArray(xom) && pS[i] >= xom.length){ /* Array do not contain enough elements - creating one additional */
                        if (i == pS.length -1){
                            xom.push(v);
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
            this.data = Object.assign(this.data,JSON.parse(JSON.stringify(object)));
            return this.data
        }
        else{
            var pS = path.split(".");
            var v = this.data;
            for (var i = 0; i < pS.length && v != undefined; i++) { // Traverse until found or undefined
                if (Array.isArray(v) && Math.abs(parseInt(pS[i]))<=v.length) { //If parent is array and path is in the index
                    if(parseInt(pS[i])<0){ /** Negative number */
                        v = v[v.length - Math.abs(parseInt(pS[i]))];
                    }
                    else{
                        v = v[parseInt(pS[i])];
                    }
                } 
                else if(Array.isArray(v) && Math.abs(parseInt(pS[i]))>v.length){ // trying to access above # of elements
                    v = this.defaultvalue || undefined
                }
                else {
                    v = v[pS[i]];
                }
            }
            if(typeof(v) != 'undefined' || v != this.defaultvalue){
                if (Array.isArray(v) && Array.isArray(object)){
                    object.forEach(function(element){
                        v.push(element);
                    })
                }
                else{
                    var newv = Object.assign(v,JSON.parse(JSON.stringify(object)));
                    this.data = this.assign(path,newv)
                }
                return this.data
            }
        }

    }

    /** Remove the v from the specific path.
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
            var pS = path.split('.');
        /* define path and create it if required */
        var xom = this.data
        for (var i=0;i<pS.length && xom != undefined;i++){ // Traverse a create if necessary
            if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == true) { //If v is a string
                if(Object(xom).hasOwnProperty(pS[i])){// if path present
                    if (i == pS.length -1){/** last element */
                        if(typeof xom[pS[i]] == "object"){
                            delete xom[pS[i]]
                        }else{
                            if(key){
                                delete xom[pS[i]]
                            }
                            else{
                                xom[pS[i]] = undefined
                            }
                            
                        }
                    }
                    else{
                        xom = xom[pS[i]]
                    }
                }
                else{// if path not present
                    return this.data
                }
            } 
            else if (typeof(pS[i]) == 'string' && isNaN(pS[i]) == false) { //If v is a number
                if(Array.isArray(xom) && Math.abs(pS[i]) < xom.length){ /* Array contain enough elements */
                    if (i == pS.length -1){ /* if the element is the last */
                        xom.splice(pS[i], 1);
                        return this.data
                    }
                    else{ 
                        xom = xom[pS[i]]
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