export default {
    HOME: "/",
    TESTPAGE: "/test/:testId/",
    CREATORWORKS: "/creator/:testId/manage/",
    SIGNIN: "/signin/",
    SIGNUP: "/signup/",
    CREATOR: "/creator/",
    MANAGETESTS: "/managetests/",
    TESTSUBMITTED: "/records/",
}

const production_api = "https://flow-test.herokuapp.com"
const local_api = "http://localhost:8081"

export const API_HOST = production_api + "/api"
