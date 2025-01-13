const express = require('express');
const app = express();
app.get("/home",(req,res)=>{
    res.send("this is home route");
})
app.get("/" ,(req, res) =>{
    res.send("This is a / route");
})

app.get('/test' ,(req, res) => {
    res.send("this is a /test route");
})
app.listen(3000, () =>{
    console.log("بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ");
});
app.use((req, res) =>{
    res.send("Hello form the server");
});