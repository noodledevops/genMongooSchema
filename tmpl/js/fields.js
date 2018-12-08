const objFields = {
    String: {type: 'String', tmpl: '%s: {type: %s %s}'},
    Buffer: {type: 'Buffer', tmpl: '%s: {type: %s %s}'},
    Boolean: {type: 'Boolean', tmpl: '%s: {type: %s %s}'},
    Date: {type: 'Date', tmpl: '%s: {type: %s %s}'},
    Number: {type: 'Number', tmpl: '%s: {type: %s %s}'},
    Mixed: {type: 'Schema.Types.Mixed' , tmpl: '%s: {type: %s %s}'},
    Decimal: {type: 'Schema.Types.Decimal128' , tmpl: '%s: {type: %s %s}'},
    ObjectId: {type: 'Schema.Types.ObjectId' , tmpl: '%s: {type: %s %s}'}, //  ref 타입 수행
    Object: {type: '{%s}', tmpl: '%s: %s'},
    Array: {type: '[%s]' , tmpl: '%s: %s'},
    Undefined: {type: '', tmpl: 'undefine: %s   '}
};

Object.keys(objFields).forEach(function(key){
    objFields.tmplFsLen = (objFields[key].tmpl.match(/%s/g) || []).length; // 형식 지정자 갯수
});

module.exports = objFields;

// tmplFsLen key 이름으로 자기 이름 반환 가능?

objFields.getKeyName = function(obj){
    var result = '';
    for(var key in this){
        if(this[key] === obj){
            result = key;
            break;
        }
    }
    return result;
};

// console.log(objFields.getKeyName(objFields.Array));
