const assert = require("assert");
const Som = require("../Simple Object Manager - JS/Som.0.1.4.js");

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
        newSom.assign('data.array.0.foo','bar');
        assert(Array.isArray(newSom.get('data.array')),'array key should be an array');
        assert(newSom.get('data.array.0.foo') == 'bar','bar should be returned');
        assert(newSom.get('data.array.0.fooz') === undefined,'undefined should be returned');
        assert(newSom.get('data.array').length == 1,'should be length 1');
        assert(newSom.get('data.array.0.fooz','something') == 'something','something should be returned');
        newSom.push('data.array',{'foo2':'bar'});
        assert(newSom.get('data.array.1.foo2') === 'bar','bar should be returned');
        newSom.assign('data.array.5.foo3','barz');
        console.log(newSom.get('data.array'));
        assert(newSom.get('data.array.2.foo3') == 'barz','barz should be returned');    
        assert(newSom.get('data.array').length == 3,'should length of 2');
    })
})

describe('Push value to empty SOM',()=>{
    test('Push test', async () => {
        let newSom = new Som();
        newSom.assign('data.object','value');
        newSom.assign('data.array.0.foo','bar');
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
        newSom.assign('data.array1.0','value1');
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
        newSom.assign('data.array1.0','value1');
        newSom.assign('data.array2.0.foo','value2');
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
        const dl = new Som({ page: { pageInfo: { id: 1}}});
        expect(dl.subSom("page").get("pageInfo.id")).toBe(1)
        expect(dl.subSom("not.exisiting").get("pageInfo.id")).toBe(undefined)
        expect(dl.subSom("page.pageInfo.id")).toBe(undefined)
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