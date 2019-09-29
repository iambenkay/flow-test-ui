export default {
    HOME: "/",
    TESTPAGE: "/test/:testId/",
    CREATORWORKS: "/creator/:testId/manage/",
    SIGNIN: "/signin/",
    SIGNUP: "/signup/",
    CREATOR: "/creator/",
    MYTESTS: "/mytests/",
    TESTSUBMITTED: "/test/submitted/successfully/:testId/"
}

const production_api = "https://flow-test.herokuapp.com"
const local_api = "http://localhost:8081"

export const API_HOST = production_api + "/api"
