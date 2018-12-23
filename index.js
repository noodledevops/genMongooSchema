const sprintf = require('sprintf-js').sprintf;
const csv = require('csvtojson');


const fs = require('fs');

const defaultOption = {
    delem: ','
};

function init(option) {

    const templMgSchmBody = fs.readFileSync(__dirname + '/tmpl/templ-mongoo.txt', 'utf-8');
    const templDefFields = require('./tmpl/js/fields');

    function GenMongooSchema() {
        this.parseDelem = (option && option.parseDelem) ? option.parseDelem : defaultOption.delem;
    }

    var TAG = GenMongooSchema.name;

    // 객체 생성
    const instance = new GenMongooSchema();

    /**
     * genSchema
     * @param schmName
     * @param schmOption
     * @param srcCsvPath
     * @param dstMgSchmDirPath
     */
    instance.genSchema = function (schmName, schmOption, srcCsvPath, dstMgSchmDirPath) {
        ///0. 인자 검사
        if (!schmName || !srcCsvPath)
            throw new Error(sprintf('%s::%s.%s', TAG, this.name, 'Error-Wrong Parameter'));
        ///1. csv 파일 로딩 및 객체 데이터로 변경
        console.log('1. 데이터 로딩 시작');
        instance.doLoadingAndParse(srcCsvPath, this.parseDelem, function(jsonObj){
            const srcMongooGenData = jsonObj;
            if(!srcMongooGenData){
                throw new Error(sprintf('%s::%s.%s', TAG, this.name, 'Error-loading data is wrong'))
            }
            // console.log(srcMongooGenData);

            console.log('완료');
            console.log('2. 스키마 객체 내용 생성 시작');
            ///2. 클래스 생성 문자열 생성
            const result = instance.doGenMgClass(schmName, srcMongooGenData, schmOption);
            // console.log(result);
            console.log('완료');
            ///3. 결과 객체 파일 저장
            console.log('3. 결과 객체 파일 저장 시작');
            fs.writeFileSync((dstMgSchmDirPath)? sprintf('%s/%s.js', schmName) : sprintf('./%s.js', schmName), result);
            console.log('완료');
        });
    };


    /**
     * doParse
     * @param srcPath
     * @param delem
     * @param callback
     */
    instance.doLoadingAndParse = function(srcPath, delem, callback) {
        csv()
            .fromFile(srcPath)
            .then(function (arr) {
                arr.forEach(function(elem){
                    Object.keys(elem).forEach(function (key) {
                        // 트림 수행
                        if(elem[key] === '') elem[key] = null;
                    });
                });
                callback(arr);
            });
    };

    /**
     * doGenMongooClass
     * @param mgSchmName
     * @param mgSchmDefFields
     * @param mgSchmMgOption
     */
    instance.doGenMgClass = function (mgSchmName, mgSchmDefFields, mgSchmMgOption) { //TODO 클로저 내부용 함수로 변경

        // field 정의 생성
        var mgSchmfieldResult = instance.doGenMgField(mgSchmDefFields);

        return instance.doGenMgSchmTotal(mgSchmfieldResult, mgSchmMgOption, mgSchmName);
        // return mgSchmfieldResult;
    };

    /**
     * doGenMgField
     * @param mgDefFields
     * @return {string}
     */
    instance.doGenMgField = function (mgDefFields) { //TODO 클로저 내부용 함수로 변경
        var fieldResult = '';
        mgDefFields.forEach(function (defField, idx) {
            // 들여쓰기
            if (idx !== 0) {
                fieldResult += '    ';
            }

            var isInnerType = defField.type === templDefFields.getKeyName(templDefFields.Array) || defField.type === templDefFields.getKeyName(templDefFields.Object);
            // 기본 속성인 경우
            if (templDefFields.hasOwnProperty(defField.type) && !isInnerType) {
                fieldResult += sprintf(
                    templDefFields[defField.type].tmpl,
                    defField.name,
                    templDefFields[defField.type].type, (defField.addOption) ? sprintf(', %s', defField.addOption) : ''
                );
                fieldResult += ',';
                fieldResult += (defField.comment) ? sprintf(' // %s', defField.comment) : '';

            }
            // Array 타입인 경우
            else if (templDefFields.hasOwnProperty(defField.type) && isInnerType) {
                fieldResult += sprintf(templDefFields[defField.type].tmpl, defField.name, sprintf(templDefFields[defField.type].type, defField.innerDef));
                fieldResult += ',';
                fieldResult += (defField.comment) ? sprintf(' // %s', defField.comment) : '';

            }
            // 타입 매칭이 안된 경우
            else {
                fieldResult += sprintf()
            }

            // 개행 문자 삽입
            fieldResult += '\n';
        });
        return fieldResult.substring(0, fieldResult.length - 2);
    };

    /**
     * doGenMgSchmTotal
     * @param strMgSchmFields
     * @param strMgSchmOption
     * @param strMgSchmName
     * @return {*}
     */
    instance.doGenMgSchmTotal = function (strMgSchmFields, strMgSchmOption, strMgSchmName) {
        return sprintf(templMgSchmBody,
            strMgSchmFields,
            (strMgSchmOption) ? sprintf(', %s', strMgSchmOption) : '',
            strMgSchmName);
    };

    // 인스턴스 반환
    return instance;
}// end of init

module.exports = init;
