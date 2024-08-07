const assert = require("assert");
const Som = require("../src/Som.js");

describe('initialize SOM with empty object and simple assign',()=>{
    test('Manipulating Som from empty object', async () => {
        let newSom = new Som();
        assert(Object.entries(newSom.data).length == 0, 'should be empty object');
        newSom.assign('data.object','value');
        assert('data'.includes(Object.keys(newSom.data)),'a data key should be present');
        data = {'foo':'bar'};
        som1 = new Som(data);
        assert(som1.get() != data,'should have been deepcopied')
        som2 = new Som(data,undefined,false)
        assert(som2.get() == data,'should NOT have been deepcopied')
        som3 = new Som(data,'else',true)
        assert(som3.get('something') == 'else','should returned else')
        som3.assign('data.foo','bar');
        som4 = new Som(som1);
        assert(JSON.stringify(som1.get()) == JSON.stringify(som4.get()),'should be similar') 
    })
})

describe('Override field with structure',()=>{
    test('setting undefined and then structure', async () => {
        let newSom = new Som({'a':undefined});
        newSom.assign('a.b','foo')
        assert(newSom.get('a.b') == 'foo','path should provide foo') 
    })
    test('setting value and then structure', async () => {
        let newSom = new Som({'a':"value"});
        newSom.assign('a.b','foo')
        assert(newSom.get('a.b') == 'foo','path should provide foo') 
    })
    test('setting a number and then structure', async () => {
        let newSom = new Som({'a':1});
        newSom.assign('a.b','foo')
        assert(newSom.get('a.b') == 'foo','path should provide foo') 
    })
})

describe('assigning value to empty SOM',()=>{
    test('Assignment test', async () => {
        let newSom = new Som();
        newSom.assign('data.object','value');
        assert(newSom.get('data.object') === 'value','value should have been returned');
        assert(newSom.get(['data.object']) === 'value','value should have been returned');
        assert(newSom.get(['data.object']) === 'value','value should have been returned');
        assert(newSom.get(['wrongValue','data.object']) === 'value','value should have been returned');
        assert(newSom.get(['wrongValue','wrong2']) === undefined,'undefined should have been returned');
        assert(newSom.get(['wrongValue','wrong2'],'') == '','empty string should have been returned');
        newSom.assign('data.array.[0].foo','bar');
        assert(Array.isArray(newSom.get('data.array')),'array key should be an array');
        assert(newSom.get('data.array.0.foo') == 'bar','bar should be returned');
        assert(newSom.get('data.array.0.fooz') === undefined,'undefined should be returned');
        assert(newSom.get('data.array').length == 1,'should be length 1');
        assert(newSom.get('data.array.0.fooz','something') == 'something','something should be returned');
        newSom.push('data.array',{'foo2':'bar'});
        assert(newSom.get('data.array.1.foo2') === 'bar','bar should be returned');
        newSom.assign('data.array.[5].foo3','barz');
        console.log(newSom.get('data.array'));
        assert(newSom.get('data.array.2.foo3') == 'barz','barz should be returned');    
        assert(newSom.get('data.array').length == 3,'should length of 2');
        newSom.assign('data.notarray.0.foo','bar');
        assert(Array.isArray(newSom.get('data.notarray')) == false,'should not be an array');
        assert(newSom.get('data.notarray.0.foo') == "bar",'should not be an array');
    })
})

describe('Push value to empty SOM',()=>{
    test('Push test', async () => {
        let newSom = new Som();
        newSom.assign('data.object','value');
        newSom.assign('data.array.[0].foo','bar');
        newSom.push('data.array',{'foo2':'bar'});
        assert(newSom.get('data.array.1.foo2') === 'bar','bar should be returned');
        newSom.assign('data.test.push','value1');
        assert(typeof newSom.get('data.test.push') == 'string','Should be type string');
        newSom.push('data.test.push','value2');
        assert(Array.isArray(newSom.get('data.test.push')),'Should be type array');
        assert(newSom.get('data.test.push').length === 2,'Should have 2 elements');
        newSom.push('data.test.push','value3',true);
        assert(newSom.get('data.test.push').length === 1,'Should have only 1 element');
        assert(newSom.get('data.test.push.0') === 'value3','value3 should be returned');
        newSom.assign('data.test.push','value4');
        assert(newSom.get('data.test.push').length == 2,'2 values should be returned');
        assert(newSom.get('data.test.push.1') == 'value4','value4 should be returned');
    })
})

describe('Remove value & clear',()=>{
    test('removing value and keys', async () => {
        let newSom = new Som();
        newSom.assign('data.object1','foo');
        newSom.assign('data.object2','bar');
        newSom.assign('data.array1.[0]','value1');
        newSom.assign('data.array1','value2');
        assert(newSom.get('data.object1') == 'foo','foo should be returned');
        newSom.remove('data.object1');
        assert(newSom.get('data.object1') == undefined,'undefined should be returned');
        assert(Object.keys(newSom.get('data')).includes('object1'),'object1 should be present');
        newSom.remove('data.object1',true);
        assert(!Object.keys(newSom.get('data')).includes('object1'),'object1 should NOT be present');
        assert(newSom.get() == newSom.remove('data.something.notExisting'),'nothing should be changed')
        newSom.remove('data.array1.0')
        assert(newSom.get('data.array1.0') == 'value2','value2 should be returned now')
        assert(newSom.get() == newSom.remove('data.array1.3'),'nothing should be changed')
        newSom.clear();
        assert(Object.entries(newSom.data).length == 0, 'should be empty object');
    })
})

describe('Replacing values',()=>{
    test('replacing values with or without regex', async () => {
        let newSom = new Som();
        newSom.assign('data.object1','foo');
        newSom.assign('data.object2','bar');
        newSom.assign('data.object3','bar');
        newSom.assign('data.array1.0','value1');
        newSom.assign('data.array2.0.foo','value2');
        assert(newSom.get('data.object1') == 'foo','foo should be returned');
        assert(newSom.get('data.object2') == 'bar' && newSom.get('data.object3') == 'bar','bar should be returned');
        assert(newSom.get('data.array1.0') == 'value1','value1 should be returned');
        assert(newSom.get('data.array2.0.foo') == 'value2','value2 should be returned');
        newSom.replace('foo','new');
        assert(newSom.get('data.object1') == 'new','new should now be returned');
        newSom.replace('value','new',true);
        assert(newSom.get('data.array1.0') == 'new','new should be returned');
        assert(newSom.get('data.array2.0.foo') == 'new','new should be returned');
    })
})

describe('Merge tests values',()=>{
    test('Merge and deep merge test', async () => {
        let newSom = new Som();
        newSom.assign('data.object1','foo');
        newSom.assign('data.object2','bar');
        newSom.assign('data.object3','bar');
        newSom.assign('data.array1.[0]','value1');
        newSom.assign('data.array2.[0].foo','value2');
        assert(Object.keys(newSom.get('data')).length == 5,'Should have five elements');
        newSom.merge('data',{'foo':'bar'});
        assert(Object.keys(newSom.get('data')).length == 6,'Should have six elements');
        newSom.merge('data',{'foo1':{'foo2':'value1'}});
        assert(Object.keys(newSom.get('data')).length == 7,'Should have seven elements');
        assert(newSom.get('data.foo1.foo2') == 'value1','value1 should be returned');
        newSom.merge('data',{'foo1':{'foo3':'value2'}});
        assert(newSom.get('data.foo1.foo2') == undefined,'undefined should be returned');
        assert(newSom.get('data.foo1.foo2','nothing') == 'nothing','nothing should be returned');
        assert(newSom.get(['data.foo1.foo2','data.foo1.foo3']) == 'value2','value2 should be returned');
        newSom.mergeDeep('data',{'foo1':{'foo2':'value1'}});
        assert(newSom.get('data.foo1.foo2') == 'value1','value1 should be returned');
        assert(Object.keys(newSom.get(['data.foo1','data.foo1.foo3'])).includes('foo3'),'foo3 should be present');
        assert(Object.keys(newSom.get(['data.foo1','data.foo1.foo3'])).includes('foo2'),'foo2 should be present');
        newSom.merge('data',{'array1':[1,2,3]});
        assert(newSom.get('data.array1').length ==3,'possess now 3 values')
        newSom.mergeDeep('data',{'array1':[4,5,6]});
        assert(newSom.get('data.array1').length ==6,'possess now 6 values')
    })
})

describe('subSom',()=> {
    test('get a subSum and request value from it', async () => {
        const dl1 = new Som({ page: { pageInfo: { id: 1}}});
        expect(dl1.subSom("page").get("pageInfo.id")).toBe(1)
        expect(dl1.subSom("not.exisiting").get("pageInfo.id")).toBe(undefined)
        expect(dl1.subSom("page.pageInfo.id")).toBe(undefined)
        const dl2 = dl1.subSom(['path1','path2'],true);
        expect(dl1.get("path1")).toBe(undefined)
        const dl3 = dl1.subSom(['path3','path4']);
        assert(JSON.stringify(dl1.get("path3")) == "{}", "it should be empty object")
    })
})
describe('getSubNodes',()=> {
    test('get sub-Soms', async () => {
        const dl = new Som({ page: { pageInfo: { id: 1}, category: { primaryCategory: "abc"}}});
        const {pageInfo, category, attributes} = dl.getSubNodes("page")
        expect(pageInfo.get("id")).toBe(1)
        expect(category.get("primaryCategory")).toBe("abc")
        expect(category.get("attributes")).toBe(undefined)
    })
    test('get sub-Soms path option', async () => {
        const dl = new Som({ page: { pageInfo: { id: 1}}});
        const {pageInfo} = dl.getSubNodes(["not.existing", "pag"])
    })
})
describe('modify',()=> {
    test('change an existing value with a function', async () => {
        const dl = new Som({ page: { pageInfo: { id: 1, value: 3}}});
        dl.modify("page.pageInfo.value", it => it + 1)
        expect(dl.get("page.pageInfo.value")).toBe(4)
    })
})

describe('search tests',()=>{
    test('Create a new SOM and a search values', async () => {
        let newSom = new Som();
        newSom.assign('data.object1','foo');
        newSom.assign('data.object2','bar');
        newSom.assign('data.object3','bar');
        newSom.assign('data.array1.[0]','value1');
        newSom.assign('data.array2.[0].foo','value2');
        results = newSom.searchValue('bar')
        assert(results['bar'].length == 2 ,'Should be found in 2 instances');
        assert(results['bar'].includes("data.object2") ,'This path should be found');
        assert(results['bar'].includes("data.object3") ,'This path should be found');
        results = newSom.searchValue('value1')
        assert(results['value1'].includes("data.array1.0") ,'the array paths should be found');
        results = newSom.searchValue('value2')
        assert(results['value2'].includes("data.array2.0.foo") ,'the array paths should be found');
    })
})

describe('stack tests',()=>{
    test('Create a new SOM with a stack activated ', async () => {
        const myObject = {
            "data":{
                "object1":"foo",
                "object2":"bar",
                "array1" : ['value1'],
                "array2" :[{
                    "foo":"value2"
                }]
            }
        }
        const callback = function(o){
            return {'value passed':o.value}
        }
        const newSom = new Som(myObject,{"stack":true,"context":callback});
        newSom.assign('data.object3.example','value')
        assert(newSom.stack.length == 1,"stack should contain only one element")
        assert(newSom.stack[0]['context']['value passed'] == "value","value should be returned")
        assert(newSom.stack[0]['method'] == "assign","assign should be returned")
        newSom.get('data.array1.0')
        assert(newSom.stack.length == 2,"stack should contain only 2 elements")
        assert(newSom.stack[1].context['value passed'] == "value1","value1 should be returned")
        assert(newSom.stack[1]['method'] == "get","get should be returned")
        newSom.replace('value2','value1')
        assert(newSom.stack.length == 3,"stack should contain only 3 elements")
        assert(newSom.stack[2].context['value passed'] == "value2","value2 should be returned")
        assert(newSom.stack[2]['method'] == "replace","replace should be returned")
        results = newSom.searchValue('value1')
        assert(results['value1'].length == 2 ,'Should be found in 2 instances');
        assert(results['value1'].includes("data.array1.0") ,'This path should be found');
        assert(results['value1'].includes("data.array2.0.foo") ,'This path should be found');
        assert(newSom.stack.length == 4,"stack should contain only 4 elements")
        assert(newSom.stack[3].context['value passed'] == results,"should give the results")
        assert(newSom.stack[3].method == "searchValue","searchValue should be returned")
        const newObject = {'data2':{'newField':'newValue'}}
        newSom.merge(newObject);
        assert(newSom.stack.length == 5,"stack should contain only 5 elements")
        assert(newSom.stack[4].context['value passed'] == newObject,"should give the newObject")
        assert(newSom.stack[4].method == "merge","merge should be returned")
        const newMerge = {'newField2':'newValue2'}
        newSom.mergeDeep('data2',newMerge);
        assert(newSom.stack.length == 6,"stack should contain only 6 elements")
        assert(JSON.stringify(newSom.stack[5].context['value passed']) == JSON.stringify(newMerge),"should give the newObject")
        assert(newSom.stack[5].method == "mergeDeep","mergeDeep should be returned")
        assert(newSom.stack[5].path == "data2","data2 path should be returned")
        mySubSom = newSom.subSom('data2');
        assert(newSom.stack.length == 7,"stack should contain only 7 elements")
        assert(newSom.stack[6].context['value passed'] instanceof(Som),"should give instance of Som")
        assert(newSom.stack[6].method == "subSom","subSom should be returned")
        assert(newSom.stack[6].path == "data2","data2 path should be returned")
        let {object1,array1} = newSom.getSubNodes('data');
        assert(newSom.stack.length == 8,"stack should contain only 8 elements")
        assert(typeof object1 == "undefined","should be undefined")
        assert(array1 instanceof(Som),"should give instance of Som")
        assert(newSom.stack[7].method == "getSubNodes","subSom should be returned")
    })
})

describe('clear test',()=> {
    test('creating a som and using the clear method ', async () => {
        let newSom = new Som();
        newSom.assign('data.object1','foo');
        newSom.assign('data.object2','bar');
        newSom.clear()
        assert(Object.entries(newSom.get()).length == 0,'should be empty object')
        assert(newSom.get('data.object2')== undefined,'should be undefined')
    })
})

describe('merging unknown path',()=>{
    test('creating som and merging with a path that does not exist',async()=>{
        let newSom = new Som();
        newSom.assign('data.a.value','bar');
        newSom.assign('data.b.value','bbr');
        assert(newSom.get('data.z.value') == undefined,'should be undefined');
        assert(newSom.get('newpath') == undefined, "should be undefined")
        newSom.merge({'data':{'z':{'value':'bzr'}}})
        newSom.merge({'newpath':'value'})
        assert(newSom.get('data.z.value') == 'bzr','should be undefined');
        assert(newSom.get('newpath') == 'value', "should be undefined")
    })
})

describe('merging arrays with function',()=>{
    test('creating som and merging with a path that does not exist',async()=>{
        let newSom = new Som();
        newSom.assign('filters.[0]',()=>console.log('something'));
        newSom.assign('filters.[1]',()=>console.log('else'));
        assert(typeof newSom.get('filters.0') == "function",'should be a function');
        assert(newSom.get('filters').length == 2,'should be 2');
        newSom.merge('filters',()=>console.log('new'))
        assert(newSom.get('filters').length == 3,'should be 3');
        assert(typeof newSom.get('filters.2') == "function",'should be 3');
    })
})

describe('deep merging arrays with function',()=>{
    test('creating som and merging with a path that does not exist',async()=>{
        let newSom = new Som()
        newSom.assign("a", {filters:[()=>1, ()=>2]})
        assert(typeof newSom.get('a.filters.1') == "function",'should be a function');
        assert(newSom.get('a.filters').length == 2,'should be a function');
        newSom.mergeDeep("a", {filters:[()=>3]})
        assert(typeof newSom.get('a.filters.2') == "function",'should be a function');
        assert(newSom.get('a.filters').length == 3,'should be a function');
    })
})


/** To be done - create an object reference
describe('loading object',()=>{
    test('using an object into SOM', async () => {
        let newSom = new Som();
        assert(newSom.get('page.pageInfo.sysEnv') == 'prod','should return prod')
        assert(newSom.get('page.category.subCategory1') == 'content','should return content')
        assert(newSom.get('page.category.subCategory10') == undefined,'should return undefined')
        assert(newSom.get('page.category.subCategory10','none existing') == 'none existing','should return none existing')
    })
})
*/