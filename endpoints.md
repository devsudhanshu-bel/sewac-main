So exact mapping:



backend-citizen-frontend

└── citizen APIs only



Admin-overview-backend

├── overview APIs

└── disposal APIs





**Admin-overview-backend:**



**GET http://localhost:5000/api/admin/overview/filters**

**GET http://18.60.41.32:5002/api/admin/overview/filters**



Expected Response:



```json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "cities": \[

&#x20;     "Bengaluru"

&#x20;   ],

&#x20;   "wards": \[

&#x20;     "Ibbaluru-174",

&#x20;     "Ward 174"

&#x20;   ]

&#x20; }

}

```



Purpose:



\* `cities` → for frontend City dropdown

\* `wards` → for frontend Ward dropdown



