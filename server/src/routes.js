module.exports = (app)=>{
    app.post("/register",(req,res)=>{
        res.send({
            message:`alo ${req.body.name} registered`,
        })
    })
}