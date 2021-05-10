const express = require("express")

const mongoose = require("mongoose")

const lodash = require("lodash")

mongoose.connect('mongodb+srv://admin-riyank:looped@cluster0.vxkct.mongodb.net/ToDo-DB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()

app.use(express.urlencoded({extended: true}))

app.use(express.static("public"))

app.set('view engine', 'ejs')

// var items = []

const todoSchema = mongoose.Schema({

  item :  String ,

})

const listScehema = mongoose.Schema({

  name : String ,

  items :  [todoSchema]   
})

const ToDo = mongoose.model("todo" , todoSchema) ;

const List = mongoose.model("list" , listScehema )

// const item1 = new ToDo({


//   item : "Item 1"
// })

// const item2 = new ToDo({


//   item : "Item 2"
// })

// const item3 = new ToDo({


//   item : "Item 3"
// })

// const pleaseWork = [item1 , item2 , item3]

// console.log(item1)
// console.log(item2)
// console.log(pleaseWork)



// ToDo.insertMany([item1 , item2 , item3]  , function(err) {
//   if(err) {
//     console.log(err)

//   } else{
//     console.log("3 items inserted")
//   }
// } )






app.get("/" , function(req , res) {


    ToDo.find(function(err, todo ) {
      if(err) {
        console.log(err)
    
      } else {
    
        var x = todo

        // console.log("TODO   " + todo)

        res.render("day" , {todoTitle : "Today" , additem : x})
               
      }
    })  

})


app.get("/:test" , function(req , res) {

  const urlTitle = lodash.capitalize(req.params.test)

  

  List.findOne({name : urlTitle} , function(err , found) {

    if(err) {
      console.log(err)
    } else if(found === null) {

      const item = new List({

        name : urlTitle ,

        items : []



      })

      item.save()

      console.log("Item SAVED TO DB")

      res.redirect("/" + urlTitle)




    } else {

      console.log("Name already there")

      // console.log(found)

  

       res.render("day" , {todoTitle : found.name, additem : found.items})
    }




  } )






})

  


app.post("/" , function(req ,res ) {




  var y = req.body.todo

  // console.log ("This is string " + y)


  const itemz = new ToDo({
 
    item : y
 
    
  })

  // console.log("This is object" + itemz)

  if(req.body.titleName === "Today"){

  
   
    itemz.save();
    
    res.redirect("/")


  } else {

    List.findOne({name : req.body.titleName} , function(err , foundPush) {
      if(err) {
        console.log(err)
      } else {
       

        foundPush.items.push(itemz)

        foundPush.save()

        

        res.redirect("/" +  req.body.titleName)
      }
    })



  }




  

})

deleteArray = []


app.post("/delete" , function(req , res) {

  // console.log(req.body.remove)

  const v = req.body.remove
  const k = req.body.titleName

  if(k === "Today") {

    deleteArray.push(v) ;

  // console.log(deleteArray)

  var j ;

  for(j=0 ; j<deleteArray.length ; j++) {

    // console.log(typeof(deleteArray[j])) ,

    ToDo.deleteOne({item : deleteArray[j]} , function(err) {

      if(err) {
        console.log(err)
      } else {
        console.log("Done")
      }

    })


  }

  res.redirect("/")



  } else {

    List.findOneAndUpdate({name : k} , {$pull : {items : {item : v}}} , function(err,foundList) {
      if(!err) {
        res.redirect("/" +  k)
      }
    })
  }

  

  
})


app.post("/deleteAll" , function(req , res) {

  // console.log(req.body.all)

  if(req.body.all === "Today") {
    ToDo.deleteMany({} , function(err) {
      if(err) {
        console.log(err) 
      } else {
        console.log("Deleted All")
        res.redirect("/")
      }
    })
  } else {

    List.findOneAndUpdate({name: req.body.all} , {$pull : {items : {}}} , function(err){

      if(!err){
        res.redirect("/" + req.body.all)
      }



    })

    
  }


})



app.listen("3000" , function() {
    console.log("Server running on port 3000")
})



