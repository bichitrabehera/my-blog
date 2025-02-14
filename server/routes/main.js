const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// routes 

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Bichitra Behera Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});



//POST

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: "Simple Blog Website"
        };
        res.render('post', { locals, data });
    } catch (err) {
        console.log("Error fetching posts:", err);
    }
});

//Search Post Route

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "Simple Blog Website"
        };

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '')

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        })
        res.render("search", {
            data,
            locals
        })
    } catch (err) {
        console.log("Error fetching posts:", err);
    }
});




// router.get('', async (req, res) => {
//     const locals = {
//         title: "NodeJS Blog",
//         description: "Simple Blog Website"
//     };

//     try {
//         const data = await Post.find();
//         console.log("Data from DB:", data); // Debugging line
//         res.render('index', { locals, data });
//     } catch (err) {
//         console.log("Error fetching posts:", err);
//     }
// });





// function insertPostData() {
//     Post.insertMany(
//         [
//             {

//                 title: "Building blog",
//                 body: "This is a blog post about building a blog with nodejs",
//             },
//             {
//                 title: "Understanding Express.js",
//                 body: "Express.js is a minimal web framework for Node.js applications."
//             },
//             {
//                 title: "Introduction to MongoDB",
//                 body: "MongoDB is a NoSQL database that stores data in JSON-like documents."
//             },
//             {
//                 title: "JavaScript ES6 Features",
//                 body: "Learn about arrow functions, template literals, and destructuring."
//             },
//             {
//                 title: "RESTful APIs with Node.js",
//                 body: "A guide to creating RESTful APIs using Express and MongoDB."
//             },
//             {
//                 title: "Asynchronous JavaScript",
//                 body: "Understanding callbacks, promises, and async/await in JavaScript."
//             },
//             {
//                 title: "Deploying a Node.js App",
//                 body: "Learn how to deploy a Node.js application to Heroku or Vercel."
//             },
//             {
//                 title: "Handling Authentication",
//                 body: "Implementing JWT authentication and securing your API."
//             },
//             {
//                 title: "Working with Mongoose",
//                 body: "Using Mongoose to interact with MongoDB in a Node.js application."
//             },
//             {
//                 title: "Best Practices for Node.js",
//                 body: "Tips for writing clean and scalable Node.js applications."
//             }
//         ]
//     )
// }

// insertPostData()

















router.get('/about', (req, res) => {
    const locals = {
        title: "Bichitra Behera Blog",
        description: "Simple Blog Website"
    };

    try {

        res.render('about', { locals});
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;



