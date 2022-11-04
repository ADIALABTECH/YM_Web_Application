const NEW_MODEL_INDEX_URL = "/new";
const NEW_MODEL_SAVE_URL = "/save";
const NEW_MODEL_LIST_RELOAD = "/insert_reload";
const TODAY_MODEL_LIST_CLEAR = "/clear";
const DELETE_SELECT_MODEL="/delete";

//오늘 검사할 시료 정보를 입력하여 결과를 리턴해준다. (기본적으로 해당 통신의 결과 Status만 발송할 예정)
//필요한 데이터 목록
//model_name = 시료 이름
//model_index = 시료의 검사 순번
export const model_save = (model_name, model_index, value_id) => {
    return fetch(NEW_MODEL_SAVE_URL, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            "model_name" : model_name,
            "index_num" :  model_index,
            "value_id" :  value_id
        })
    }).then((res) => res.json());
}

//입력된 검사 모듈 중 오늘자 날짜로만 검색해서 현재 입력할 index_number를 리턴해준다.
// check_data = 입력한 index_number
// date = 오늘 날짜를 String 형태로 반환
export const NewModelIndex = () => {
    return fetch(NEW_MODEL_INDEX_URL,{
        method: 'POST',
        headers: {'content-type': 'application/json'}
    }).then((res) => res.json());
}

//모델 입력 이후에 화면을 재 리로딩 하기 위한 함수
//여기에는 나중에 websocket 통신으로 수정 가능, 비가능한 모델들을 리로딩하는데에도 사용될것임
export const ReloadInsert = () => {
    return fetch(NEW_MODEL_LIST_RELOAD, {
        method: 'GET',
        headers: {'content-type': 'application/json'}
    }).then((res) => res.json());

}

//모델 입력 이후에 화면을 재 리로딩 하기 위한 함수
//여기에는 나중에 websocket 통신으로 수정 가능, 비가능한 모델들을 리로딩하는데에도 사용될것임
export const ClearTodayModel = () => {
    return fetch(TODAY_MODEL_LIST_CLEAR, {
        method: 'POST',
        headers: {'content-type': 'application/json'}
    }).then((res) => res.json());
}

//모델 삭제 이후에 화면을재 리로딩하기 위한 함수
//여기에는 나중에 websocket 통신으로 수정 가능, 비가능한 모델들을 리로딩하는데에도 사용될것임
export const DeleteModel = (model_name, model_index, value_id) => {
    return fetch(DELETE_SELECT_MODEL, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            "model_name" : model_name,
            "index_num" :  model_index,
            "value_id" :  value_id
        })
    }).then((res) => res.json());

}

//실시간으로 들어오는 데이터 정보를 보여주기 위한 함수
//main에서 사용할 것임
export const ShowLiveInfo = () => {
    return fetch()
}