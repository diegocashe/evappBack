import app from "./config/server";
import syncDataBase from "./config/SyncDatabase";

syncDataBase().then(()=>{
    app.listen(app.get('port'), () => {
        console.log('Server on port ', app.get('port'));
    })
});
