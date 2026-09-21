const assert = require("assert");
const Som = require("../src/Som.js");

function withSilencedWarn(fn){
    const orig = console.warn;
    const captured = [];
    console.warn = (...args) => { captured.push(args.join(' ')); };
    try { fn(captured); }
    finally { console.warn = orig; }
}

/* Remove any key we may have attempted to add to Object.prototype, so a
 * failure in one test doesn't cascade into every subsequent test. */
function cleanProto(...keys){
    for (const k of keys){ delete Object.prototype[k]; }
}

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
        soAnalytics = new Som(data,'else',true)
        assert(soAnalytics.get('something') == 'else','should returned else')
        soAnalytics.assign('data.foo','bar');
        som4 = new Som(som1);
        assert(JSON.stringify(som1.get()) == JSON.stringify(som4.get()),'should be similar') 
    })
})

describe('Testing the GET capabilities', ()=>{
    test('Simple Structure & simple Get',async()=>{
        let newSom = new Som();
        newSom.assign('my.object','foo');
        newSom.assign('my.array',[1,2,3]);
        newSom.assign('my.set',new Set(['1',2,'3']));
        newSom.assign('my.number',2);
        assert(typeof newSom.get('my') == 'object', 'Should be returning an object');
        assert(newSom.get('my.object') == 'foo', 'Should be returning the foo value');
        assert(newSom.get('my.number') == 2, 'Should be returning 2');
        assert(newSom.get('my.set.3'), 'Should be returning true');
        assert(newSom.get('my.array.2') == 3, 'Should be returning 3');
        newSom.assign('my.zero',0)
        assert(newSom.get('my.zero') == 0, 'Should be returning 0');
        assert(newSom.get('my.zerosss',0) == 0, 'Should be returning 0');
    })
    test('Simple Structure & complex Get',async()=>{
        let newSom = new Som();
        newSom.assign('my.array',[1,2,3]);
        newSom.assign('my.set',new Set(['1',2,'3']));
        expect(newSom.get('my.set.2')).toBe(true);
        expect(newSom.get('my.array.2',undefined,{arraycheck:true})).toBe(true);
    })
    test('Multiple paths preserve falsy values from the first matching path',async()=>{
        expect(new Som({a: 0, b: 2}).get(['a','b'])).toBe(0);
        expect(new Som({a: false, b: true}).get(['a','b'])).toBe(false);
        expect(new Som({a: '', b: 'fallback'}).get(['a','b'])).toBe('');
        expect(new Som({a: null, b: 'fallback'}).get(['a','b'])).toBeNull();
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
    test('using the override capability',async()=>{
        let newSom = new Som({'a':1});
        newSom.assign('a',2,undefined,{override:true})
        assert(newSom.get('a') == 2,'value should be 2')
    })
})

describe('Testing Set capability',()=>{
    test('Setting a set',async()=>{
        let newSom = new Som({'a':'b'})
        mySet = new Set();
        newSom.assign('mySet',mySet);
        assert(typeof newSom.get('mySet') == 'object','it should have created an object')
        assert(newSom.get('mySet') instanceof Set,'it should be an instance of Set')
    })

    test('Assigning to a set',async()=>{
        let newSom = new Som({'a':'b'})
        mySet = new Set();
        newSom.assign('mySet',mySet);
        newSom.assign('mySet','a')
        assert(newSom.get('mySet').has('a'),'it should have a')
        assert(!newSom.get('mySet').has('b'),'it should NOT have b')
        assert(newSom.get('mySet').size == 1,'it should be of size 1')
        newSom.assign('mySet','a');
        assert(newSom.get('mySet').size == 1,'it should still be of size 1')
        newSom.assign('mySet','b');
        assert(newSom.get('mySet').size == 2,'it should be of size 2')
        assert(newSom.get('mySet').has('b'),'it should have b')
        newSom.push('mySet','b');
        assert(newSom.get('mySet').size == 2,'it should be of size 2')
        assert(newSom.get('mySet').has('b'),'it should have b')
        assert(newSom.get('mySet.b'),'it should return true')
        assert(!newSom.get('mySet.c'),'it should return !false')
        newSom.push('mySet','c');
        assert(newSom.get('mySet').size == 3,'it should be of size 3')
        assert(newSom.get('mySet.c'),'it should return true')
    })

    test('Assigning to a set',async()=>{
        let newSom = new Som({'a':'b'})
        mySet = new Set();
        newSom.assign('mySet',mySet);
        newSom.assign('mySet','a')
        assert(newSom.get('mySet').has('a'),'it should have a')
        expect(newSom.get('mySet').has('b')).toBe(false)
        assert(newSom.get('mySet').size == 1,'it should be of size 1')
        newSom.assign('mySet','a')
        assert(newSom.get('mySet').size == 1,'it should still be of size 1')
        newSom.assign('mySet','b')
        assert(newSom.get('mySet').size == 2,'it should be of size 2')
        assert(newSom.get('mySet').has('b'),'it should have b')
    })

    test('getting from a set',async()=>{
        let newSom = new Som()
        newSom.assign('my.set',new Set(['key1']));
        assert(newSom.get('my.set').size == 1,'it should been of size 1')
        assert(newSom.get('my.set.key1'),'it should return true')
        expect(newSom.get('my.set.key2')).toBe(false)
    })

    test('Testing type assignment capability',async()=>{
        let newSom = new Som()
        newSom.assign('my.array','key1');
        assert(typeof newSom.get('my.array') === 'string','It should be a string');
        newSom.assign('my.array','key1',undefined,{type:Array});
        assert(newSom.get('my.array') instanceof Array,'It should be an Array');
        assert(newSom.get('my.array').length == 2,'It should be of length 2');
        newSom.assign('my.array','key1',undefined,{type:Set});
        assert(newSom.get('my.array') instanceof Set,'It should be a Set');
        assert(newSom.get('my.array').size == 1,'It should be of length 2');
        newSom.assign('my.set',2);
        assert(typeof newSom.get('my.set') === "number",'It should be a number');
        newSom.assign('my.set',3,undefined,{type:Set});
        assert(newSom.get('my.set') instanceof Set,'It should be a set');
        assert(newSom.get('my.set').size == 2,'It should be of size 2');
        newSom.assign('my.set',3,undefined,{type:Array});
        assert(newSom.get('my.set') instanceof Array,'It should be an Array');
        assert(newSom.get('my.set').length == 3,'It should be of size 3');
        newSom.assign('my.set',1,undefined,{type:Set,override:true});
        assert(newSom.get('my.set') instanceof Set,'It should be a set');
        assert(newSom.get('my.set').size == 1,'It should be of size 1');
        assert(newSom.get('my.set.1'),'It should be true');
    })
    test('Testing Array or Set assignment to existing structure',async()=>{
        let newSom = new Som()
        newSom.assign('my.array',['key1']);
        newSom.assign('my.set',new Set(['key1']))
        setTest = new Set(['key1','key2'])
        arrayTest = ['key1','key2']
        newSom.assign('my.array',arrayTest);
        assert(newSom.get('my.array').length == 3,"There should 3 items")
        newSom.assign('my.set',setTest);
        assert(newSom.get('my.set').size == 2,"There should 2 items")
        newSom.assign('my.array',setTest);
        assert(newSom.get('my.array').length == 5,"There should 5 items")
        newSom.assign('my.set',arrayTest);
        assert(newSom.get('my.set').size == 2,"There should 2 items")
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
        newSom.assign('data.mySet',new Set(['key1','key2','key3']));
        newSom.remove('data.mySet.key4');
        assert(newSom.get('data.mySet').size == 3,'It should still be 3 elements')
        newSom.remove('data.mySet.key3');
        assert(newSom.get('data.mySet').size == 2,'It should only be 2 elements')
        newSom.assign('data.mySet','key4',undefined,{type:Array});
        newSom.remove('data.mySet.key4');
        assert(newSom.get('data.mySet').length == 2,'It should only be 2 elements')
        newSom.remove('data.mySet.key3');
        assert(newSom.get('data.mySet').length == 2,'It should still be 2 elements')
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
    }),
    test('Replacing complex structure',async() => {
        let newSom = new Som();
        newSom.assign('my.set',new Set(["value1","value2","value3"]))
        newSom.assign('my.normal.path','value2');
        newSom.assign('my.array',['value1','value2','value3']);
        expect(newSom.get('my.set').size).toBe(3);
        expect(newSom.get('my.array').length).toBe(3);
        expect(newSom.get('my.set.value1')).toBe(true);
        newSom.replace('value1','new1');
        expect(newSom.get('my.set.value1')).toBe(false);
        newSom.replace('value','new2',true);
        expect(newSom.get('my.set').size).toBe(2);
        expect(newSom.get('my.array').length).toBe(3);
        expect(newSom.get('my.set.new2')).toBe(true);
        expect(newSom.get('my.set.new1')).toBe(true);
        expect(newSom.get('my.array').includes('new1')).toBe(true);
        expect(newSom.get('my.array').includes('new2')).toBe(true);
    })
    test('Replacing skips null values without stopping sibling traversal',async() => {
        const newSom = new Som({a: null, b: 'old', c: {d: 'old'}});
        newSom.replace('old','new');
        expect(newSom.get('a')).toBeNull();
        expect(newSom.get('b')).toBe('new');
        expect(newSom.get('c.d')).toBe('new');
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
    test('Deep merge treats null as a terminal value', async () => {
        const newSom = new Som({data:{object:{nested:true}, keep:'value'}});
        newSom.mergeDeep('data', {object:null});
        expect(newSom.get('data.object')).toBeNull();
        expect(newSom.get('data.keep')).toBe('value');
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
    test('calls the modifier once and records the assigned value in the stack', async () => {
        let calls = 0;
        const dl = new Som({ page: { value: 3 }}, {stack:true, context: o => ({value:o.value})});
        dl.modify("page.value", it => {
            calls += 1;
            return it + 1;
        })
        expect(calls).toBe(1);
        expect(dl.get("page.value", undefined, {origin:'internal'})).toBe(4);
        expect(dl.stack.length).toBe(1);
        expect(dl.stack[0].method).toBe('modify');
        expect(dl.stack[0].context.value).toBe(4);
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

describe('own-property traversal',()=>{
    test('replace ignores inherited enumerable properties', async () => {
        const obj = Object.create({ inherited: 'old' });
        obj.own = 'old';
        const newSom = new Som(obj, {deepcopy:false});
        newSom.replace('old', 'new');
        expect(newSom.get('own')).toBe('new');
        expect(Object.prototype.hasOwnProperty.call(newSom.get(), 'inherited')).toBe(false);
    })

    test('searchValue ignores inherited enumerable properties', async () => {
        const obj = Object.create({ inherited: 'target' });
        obj.own = 'target';
        const newSom = new Som(obj, {deepcopy:false});
        const results = newSom.searchValue('target');
        expect(results['target']).toEqual(['own']);
    })

    test('mergeDeep ignores inherited enumerable properties from payloads', async () => {
        const payload = Object.create({ inherited: 'bad' });
        payload.own = 'good';
        const newSom = new Som({});
        newSom.mergeDeep(payload);
        expect(newSom.get('own')).toBe('good');
        expect(newSom.get('inherited')).toBeUndefined();
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
    test('merging a missing path works when a default value is configured',async()=>{
        const newSom = new Som({}, {dv:'default'});
        expect(() => newSom.merge('missing', {value:'created'})).not.toThrow();
        expect(newSom.get('missing.value')).toBe('created');
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

describe('circular reference handling', () => {
 
    /**
     * Simulates a data layer object that references itself — a common pattern in
     * browser environments where a top-level object is attached back onto one of its own child nodes.
     *
     * Without the WeakSet guard these tests would hang / stack-overflow. With the
     * fix they should complete and return correct results.
     */
 
    test('replace: does not infinite-loop on a self-referencing object', () => {
        // obj.self === obj  →  direct self-reference
        const obj = { brand: 'Adobe', model: 'Analytics' };
        obj.self = obj;
        const s = new Som(obj, { deepcopy: false });
 
        // Should complete without throwing / hanging
        expect(() => s.replace('Adobe', 'Other')).not.toThrow();
 
        // The value that existed in the normal part of the tree must be replaced
        expect(s.get('brand')).toBe('Other');
        // Untouched value must remain
        expect(s.get('model')).toBe('Analytics');
    })

    test('replace: Som instance assigned as value — correct variable name fixes the ReferenceError', () => {
        // This is the corrected version of the original snippet with `s` renamed
        // to `mysom` consistently.
        const obj = { brand: 'Adobe', model: 'Analytics', som: undefined };
        const mysom = new Som(obj, { deepcopy: false });
        mysom.assign('som', mysom);
 
        // Correct variable — must not throw
        expect(() => mysom.replace('Adobe', 'Other')).not.toThrow();
 
        expect(mysom.get('brand')).toBe('Other');
        expect(mysom.get('model')).toBe('Analytics');
    })
 
 
    test('replace: does not infinite-loop on a nested circular reference', () => {
        // child.parent === root  →  ancestor back-reference (common in DOM-like trees)
        const root = { section: 'home', meta: { author: 'home', level: 'top' } };
        root.meta.parent = root; // nested node points back to root
        const s = new Som(root, { deepcopy: false });
 
        expect(() => s.replace('home', 'away')).not.toThrow();
 
        // Both occurrences of 'home' in the acyclic part of the tree must be replaced
        expect(s.get('section')).toBe('away');
        expect(s.get('meta.author')).toBe('away');
        // Unrelated value must be untouched
        expect(s.get('meta.level')).toBe('top');
    })
 
    test('replace: does not infinite-loop on a circular reference inside an array', () => {
        // An object inside an array that references the root — another real-world pattern
        const root = { items: [{ label: 'target', value: 1 }] };
        root.items[0].container = root; // array element points back to root
        const s = new Som(root, { deepcopy: false });
 
        expect(() => s.replace('target', 'replaced')).not.toThrow();
 
        expect(s.get('items.0.label')).toBe('replaced');
        expect(s.get('items.0.value')).toBe(1);
    })
 
    test('replace with regex: does not infinite-loop on a self-referencing object', () => {
        const obj = { label: 'foo_bar', other: 'baz' };
        obj.self = obj;
        const s = new Som(obj, { deepcopy: false });
 
        expect(() => s.replace('foo_.*', 'replaced', true)).not.toThrow();
 
        expect(s.get('label')).toBe('replaced');
        expect(s.get('other')).toBe('baz');
    })
 
    test('replace: normal (non-circular) behaviour is unchanged', () => {
        // Sanity-check that the WeakSet guard does not affect the happy path
        const s = new Som({ a: 'old', b: { c: 'old', d: 'keep' }, arr: ['old', 'keep'] });
        s.replace('old', 'new');
 
        expect(s.get('a')).toBe('new');
        expect(s.get('b.c')).toBe('new');
        expect(s.get('b.d')).toBe('keep');
        expect(s.get('arr.0')).toBe('new');
        expect(s.get('arr.1')).toBe('keep');
    })
 
    test('searchValue: does not infinite-loop on a self-referencing object', () => {
        const obj = { section: 'home', title: 'home' };
        obj.self = obj;
        const s = new Som(obj, { deepcopy: false });
 
        let result;
        expect(() => { result = s.searchValue('home'); }).not.toThrow();
 
        // Both paths in the acyclic part of the tree must be found
        expect(result['home']).toContain('section');
        expect(result['home']).toContain('title');
        // The circular reference must NOT produce duplicate/phantom paths
        expect(result['home'].length).toBe(2);
    })
 
    test('searchValue: does not infinite-loop on a nested circular reference', () => {
        const root = { page: { name: 'target', env: 'prod' }, site: 'target' };
        root.page.parent = root; // nested back-reference
        const s = new Som(root, { deepcopy: false });
 
        let result;
        expect(() => { result = s.searchValue('target'); }).not.toThrow();
 
        expect(result['target']).toContain('page.name');
        expect(result['target']).toContain('site');
        expect(result['target'].length).toBe(2);
    })
 
    test('searchValue with regex: does not infinite-loop on a self-referencing object', () => {
        const obj = { brand: 'Adobe_Analytics', model: 'Adobe_X5', other: 'unrelated' };
        obj.self = obj;
        const s = new Som(obj, { deepcopy: false });
 
        let result;
        expect(() => { result = s.searchValue('Adobe_.*', true); }).not.toThrow();
 
        expect(result['Adobe_.*']).toContain('brand');
        expect(result['Adobe_.*']).toContain('model');
        expect(result['Adobe_.*'].length).toBe(2);
    })
 
    test('searchValue: normal (non-circular) behaviour is unchanged', () => {
        // Sanity-check that the WeakSet guard does not affect the happy path
        const s = new Som({
            a: 'val',
            b: { c: 'val', d: 'other' },
            arr: [{ key: 'val' }, { key: 'skip' }]
        });
        const result = s.searchValue('val');
 
        expect(result['val']).toContain('a');
        expect(result['val']).toContain('b.c');
        expect(result['val']).toContain('arr.0.key');
        expect(result['val'].length).toBe(3);
    })
})

describe('prototype pollution - traversal and lookup', ()=>{
    test('constructor strips unsafe keys from JSON payloads', async () => {
        const payload = JSON.parse('{"__proto__":{"polluted_ctor":true},"ok":1}');
        let som;
        withSilencedWarn(() => { som = new Som(payload); });
        expect(som.get('ok')).toBe(1);
        expect(som.get().polluted_ctor).toBeUndefined();
        expect(Object.getPrototypeOf(som.get()).polluted_ctor).toBeUndefined();
        cleanProto('polluted_ctor');
    });

    test('get rejects dangerous segments before traversing the prototype chain', async () => {
        const som = new Som({ safe: { nested: true }, value: 'kept' });
        withSilencedWarn(() => {
            expect(som.get('__proto__.polluted')).toBeUndefined();
            expect(som.get('constructor.prototype.polluted')).toBeUndefined();
            expect(som.get('safe.__proto__.polluted')).toBeUndefined();
        });
        assert(({}).polluted === undefined, 'Object.prototype must not be reached by get()');
        cleanProto('polluted');
    });

    test('remove rejects dangerous segments instead of deleting inherited properties', async () => {
        const som = new Som({ safe: { nested: true } });
        withSilencedWarn(() => {
            expect(som.remove('constructor.prototype.polluted')).toBe(som.get());
            expect(som.remove('__proto__.polluted')).toBe(som.get());
            expect(som.remove('safe.__proto__.polluted')).toBe(som.get());
        });
        assert(({}).polluted === undefined, 'Object.prototype must not be mutated by remove()');
        cleanProto('polluted');
    });
});

describe('prototype pollution - merge', ()=>{
    test('merge with "__proto__" as path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.merge('__proto__', {polluted_m1: true}));
        assert(({}).polluted_m1 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_m1');
    });

    test('merge with "constructor" as path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.merge('constructor', {polluted_m2: true}));
        assert(({}).polluted_m2 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_m2');
    });

    test('merge strips "__proto__" key from a root-level object payload', async () => {
        const dl = new Som({});
        const payload = JSON.parse('{"__proto__":{"polluted_m3":true}, "legit":"kept"}');
        withSilencedWarn(()=> dl.merge(payload));
        assert(({}).polluted_m3 === undefined, 'Object.prototype must not be polluted');
        assert(dl.get('legit') === 'kept', 'non-dangerous keys must still merge');
        cleanProto('polluted_m3');
    });

    test('merge strips "constructor" key from a root-level object payload', async () => {
        const dl = new Som({});
        const payload = {constructor: {prototype: {polluted_m4: true}}, legit: 'kept'};
        withSilencedWarn(()=> dl.merge(payload));
        assert(({}).polluted_m4 === undefined, 'Object.prototype must not be polluted');
        assert(dl.get('legit') === 'kept', 'non-dangerous keys must still merge');
        /* data.constructor should remain the native Object constructor, not our injection */
        assert(typeof dl.data.constructor === 'function', 'constructor must not be overwritten');
        cleanProto('polluted_m4');
    });

    test('merge emits a console.warn when an unsafe key is dropped', async () => {
        const dl = new Som({});
        let captured;
        withSilencedWarn(c => {
            dl.merge('__proto__', {x: 1});
            captured = c.slice();
        });
        assert(captured.length >= 1, 'console.warn should have been called');
        assert(captured[0].includes('__proto__'), 'warning should mention the key');
        assert(captured[0].includes('Som.merge'), 'warning should identify the method');
    });
});

describe('prototype pollution - mergeDeep', ()=>{
    test('mergeDeep with "__proto__" as path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.mergeDeep('__proto__', {polluted_md1: true}));
        assert(({}).polluted_md1 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_md1');
    });

    test('mergeDeep skips "__proto__" key nested inside a payload', async () => {
        const dl = new Som({a: {b: {}}});
        withSilencedWarn(()=> dl.mergeDeep({a: {b: {'__proto__': {polluted_md2: true}, safe: 'ok'}}}));
        assert(({}).polluted_md2 === undefined, 'Object.prototype must not be polluted');
        /* The safe sibling key should still be merged */
        assert(dl.get('a.b.safe') === 'ok', 'non-dangerous sibling keys must still merge');
        cleanProto('polluted_md2');
    });

    test('mergeDeep skips "constructor.prototype" chain in payload', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.mergeDeep({constructor: {prototype: {polluted_md3: true}}}));
        assert(({}).polluted_md3 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_md3');
    });

    test('mergeDeep skips "__proto__" from a JSON-parsed payload (own property)', async () => {
        const dl = new Som({});
        const payload = JSON.parse('{"__proto__":{"polluted_md4":true}, "legit":"kept"}');
        withSilencedWarn(()=> dl.mergeDeep(payload));
        assert(({}).polluted_md4 === undefined, 'Object.prototype must not be polluted');
        assert(dl.get('legit') === 'kept', 'non-dangerous keys must still merge');
        cleanProto('polluted_md4');
    });
});

describe('prototype pollution - assign', ()=>{
    test('assign with a "__proto__" segment in the path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.assign('__proto__.polluted_a1', true));
        assert(({}).polluted_a1 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_a1');
    });

    test('assign with a "constructor.prototype" segment in the path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.assign('constructor.prototype.polluted_a2', true));
        assert(({}).polluted_a2 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_a2');
    });

    test('assign with a "prototype" segment in the path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.assign('prototype.polluted_a3', true));
        assert(({}).polluted_a3 === undefined, 'Object.prototype must not be polluted');
        cleanProto('polluted_a3');
    });

    test('assign with an unsafe segment anywhere in the path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.assign('a.b.__proto__.c', true));
        /* "a" should NOT have been created since we bail before touching data */
        assert(dl.get('a') === undefined, 'path creation must be aborted on unsafe segment');
    });

    test('assign object-form strips unsafe keys', async () => {
        const dl = new Som({});
        const payload = JSON.parse('{"__proto__":{"polluted_a5":true}, "legit":"kept"}');
        withSilencedWarn(()=> dl.assign(payload));
        assert(({}).polluted_a5 === undefined, 'Object.prototype must not be polluted');
        assert(dl.get('legit') === 'kept', 'non-dangerous keys must still assign');
        cleanProto('polluted_a5');
    });
});

describe('prototype pollution - push', ()=>{
    test('push with "__proto__" as path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.push('__proto__', 'x'));
        /* Array index 0 on Object.prototype would manifest as ({})[0] */
        assert(({})[0] === undefined, 'Object.prototype must not be polluted');
    });

    test('push with an unsafe segment anywhere in the path is rejected', async () => {
        const dl = new Som({});
        withSilencedWarn(()=> dl.push('a.__proto__.b', 'x'));
        assert(dl.get('a') === undefined, 'path creation must be aborted on unsafe segment');
    });
});

describe('prototype pollution - operation is not recorded in stack', ()=>{
    test('rejected merge does not add an entry to the stack', async () => {
        const dl = new Som({}, {stack: true});
        withSilencedWarn(()=> dl.merge('__proto__', {x: 1}));
        assert(dl.stack.length === 0, 'rejected operations must not pollute the stack');
    });

    test('rejected assign does not add an entry to the stack', async () => {
        const dl = new Som({}, {stack: true});
        withSilencedWarn(()=> dl.assign('__proto__.x', 1));
        assert(dl.stack.length === 0, 'rejected operations must not pollute the stack');
    });

    test('legitimate operations still record normally after a rejected one', async () => {
        const dl = new Som({}, {stack: true});
        withSilencedWarn(()=> dl.merge('__proto__', {x: 1}));
        dl.assign('a.b', 'value');
        assert(dl.stack.length === 1, 'legitimate op should still record');
        assert(dl.stack[0].method === 'assign', 'stack should only contain the legit op');
    });
});

describe('prototype pollution - prior pollution does not leak back in', ()=>{
    test('a new Som does not inherit polluted keys through get', async () => {
        /* Simulate an out-of-band pollution (e.g. from another library). */
        Object.prototype.evilLeak = 'hacked';
        try {
            const dl = new Som({});
            /* get with no path returns the data object directly, and "evilLeak"
             * is on the prototype chain of every object. This test documents
             * current behavior: get() returns the data object, and hasOwnProperty
             * on data should be false for evilLeak even though access works. */
            assert(Object.prototype.hasOwnProperty.call(dl.data, 'evilLeak') === false,
                'data must not have an own "evilLeak" property');
        } finally {
            cleanProto('evilLeak');
        }
    });
});