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

export const API_HOST = (process.env.API_HOST || "http://localhost:8081") + "/api"
