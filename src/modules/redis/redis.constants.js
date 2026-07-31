export const REDIS_KEYS = {



    AUTH_SESSION:
        (userId)=>
            `auth:session:${userId}`,



    USER_PROFILE:
        (userId)=>
            `user:profile:${userId}`,



    DASHBOARD_OVERVIEW:
        "dashboard:overview",



    DASHBOARD_VEHICLES:
        "dashboard:vehicles",



    CITIZEN_HOME:
        (phone)=>
            `citizen:home:${phone}`,



    TRUCK_LOCATION:
        (vehicleId)=>
            `truck:location:${vehicleId}`,



    MAP_ACTIVE_TRUCKS:
        "map:active:trucks"

};