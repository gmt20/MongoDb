const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('catalog',['products']);

const app = express();
const port = 3000
app.use(bodyParser.json());

app.get('/', (req,res,next) =>{
  res.send('Please use /api/products!');

});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//fetch all products
app.get('/api/Products', (req,res,next) =>{
  db.products.find((err,docs) =>{
    if(err){
      res.send(err);
    }
    console.log('Products Found....');
    res.json(docs);
  });
});

//fetch single product
app.get('/api/Products/:id', (req,res,next) =>{
  db.products.find({_id:mongojs.ObjectId(req.params.id)},(err,doc) =>{
    if(err){
      res.send(err);
    }
    console.log('Product Found....');
    res.json(doc);
  });
});

//add product
app.post('/api/Products', (req,res,next) =>{
  db.products.insert(req.body,(err, doc)=> {
    if(err){
      res.send(err);
    }
    console.log('Adding Product');
    res.json(doc);

  });
});

//update product
app.put('/api/Products/:id', (req,res,next) =>{
  db.products.findAndModify({query: {_id:mongojs.ObjectId(req.params.id)},
  update:{
    $set:{
      name: req.body.name,
      category: req.body.category

    }
  },
  new: true}, (err,doc)=>  {
    if(err){
      res.send(err);
    }

  console.log('Updating product..');
  res.json(doc);

});
});

//delete product
app.delete('/api/Products/:id', (req,res,next) =>{
  db.products.remove({_id:mongojs.ObjectId(req.params.id)}, (err,doc) => {
    if(err){
      res.send(err);
    }

  console.log('Updating product..');
  res.json(doc);
  });
});

app.listen(port, () =>{
  console.log('Server started on port'+port);

});
