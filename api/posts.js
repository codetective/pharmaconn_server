const express = require('express');
const router = express.Router()
const HousingPost = require('../models/HousingPosts')
const ForSalePosts = require('../models/ForSalePosts')
const AllPosts = require('../models/AllPosts')
const Jobs = require('../models/Jobs')
const GarageSale = require('../models/GarageSale')
const Free = require('../models/Free')
const Classes = require('../models/Classes')
const Events = require('../models/Events')
const Volunteers = require('../models/Volunteers')
const LostAndFound = require('../models/LostAndFound')
const Services = require('../models/Services')
const validateData = require('../validateForms/validateData')
const validateFilters = require('../validateForms/validateFilters')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const keys = require('../config/keys')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const AmazonS3URI = require('amazon-s3-uri')
mongoose.set('useFindAndModify', false);
const passport = require('passport')

aws.config.update({
    secretAccessKey: keys.secretAccessKey,
    accessKeyId: keys.accessKeyId,
    region: 'ap-southeast-2'
})
const s3 = new aws.S3();


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
        cb(null, true)
    }
    else {
        cb(new Error('Invalid Type'), false)
    }
}

const size = (req, file, cb) => {
    if (file.size < 5000000) {
        cb(null, true)
    }
    else {
        cb(new Error('Max File Size 5 MB'), false)
    }
}


const upload = multer({
    fileFilter: fileFilter,
    size: size,
    storage: multerS3({
        s3: s3,
        bucket: 'lodos',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})




router.post('/updatepost', passport.authenticate('jwt', { session: false }), upload.array('image', 6), (req, res) => {

    let collection;

    if (req.body.category === "forsale") {
        collection = 'forSaleModel'
    }
    if (req.body.category === "housing") {
        collection = 'housingModel'
    }

    if (req.body.category === "volunteers") {
        collection = 'volunteersModel'
    }
    if (req.body.category === "services") {
        collection = 'servicesModel'
    }
    if (req.body.category === "events") {
        collection = 'eventsModel'
    }
    if (req.body.category === "classes") {
        collection = 'classesModel'
    }
    if (req.body.category === "free") {
        collection = 'freeModel'
    }
    if (req.body.category === "garagesale") {
        collection = 'garageSaleModel'
    }

    if (req.body.category === "jobs") {
        collection = 'jobsModel'
    }
    if (req.body.category === "lostandfound") {
        collection = 'lostandfoundModel'
    }
    const { errors, isValid } = validateData(req.body)
    const fileArray = req.files;

    if (!isValid) {
        for (let i = 0; i < fileArray.length; i++) {
            s3.deleteObjects({
                Bucket: 'lodos',
                Delete: {
                    Objects: [{
                        Key: fileArray[i].key
                    }]
                }

            }, function (err, data) {
                if (err) console.log(err + 'error 2');
                else console.log(data + 'data');
            })
        }
        return res.status(400).json(errors)
    }

    const listoflinks = [];

    if (fileArray.length !== 0) {

        for (let i = 0; i < fileArray.length; i++) {
            const link = fileArray[i].location
            listoflinks.push(link)
        }
    }


    const updateData = {}

    if (req.body.odometer) {
        updateData.odometer = req.body.odometer
    }
    if (req.body.model) {
        updateData.model = req.body.model
    }
    if (req.body.make) {
        updateData.make = req.body.make
    }
    if (req.body.title) {
        updateData.title = req.body.title
    }
    if (req.body.price) {
        updateData.price = req.body.price
    }
    if (req.body.category) {
        updateData.category = req.body.category
    }
    if (req.body.subcategory) {
        updateData.subcategory = req.body.subcategory
    }
    if (req.body.condition) {
        updateData.condition = req.body.condition
    }
    if (req.body.language) {
        updateData.language = req.body.language
    }
    if (req.body.email) {
        updateData.email = req.body.email
    }
    if (req.body.phonenumber) {
        updateData.phonenumber = req.body.phonenumber
    }
    if (req.body.description) {
        updateData.description = req.body.description
    }
    if (req.body.salary) {
        updateData.salary = req.body.salary
    }
    if (req.body.company) {
        updateData.company = req.body.company
    }
    if (req.body.when) {
        updateData.when = req.body.value
    }

    mongoose.model(collection).findOneAndUpdate({ _id: req.body.postid }, {
        $set: updateData,
        $push: { links: listoflinks }
    }, { useFindAndModify: false })
        .then((oldpost) => {
            mongoose.model(collection).findById(req.body.postid)
                .then(updatedpost => {

                    AllPosts.updateOne(
                        {
                            // "user": ObjectId(req.query.userid),
                            'posts': {
                                $elemMatch: { postid: req.body.postid }
                            }
                        },
                        {
                            $set: {

                                'posts.$.postid': updatedpost._id,
                                'posts.$.title': updatedpost.title,
                                'posts.$.category': updatedpost.category,
                                'posts.$.subcategory': updatedpost.subcategory,

                            }
                        })
                        .then(() => {
                            res.json('success')
                        })
                        .catch(err => console.log(err))
                }).catch(err => res.status(401).json(err))
        }).catch(err => res.status(401).json(err))



})



router.delete('/deletephotos', passport.authenticate('jwt', { session: false }), (req, res) => {
    let collection;

    if (req.query.category === "forsale") {
        collection = 'forSaleModel'
    }
    if (req.query.category === "housing") {
        collection = 'housingModel'
    }

    if (req.query.category === "volunteers") {
        collection = 'volunteersModel'
    }
    if (req.query.category === "services") {
        collection = 'servicesModel'
    }
    if (req.query.category === "events") {
        collection = 'eventsModel'
    }
    if (req.query.category === "classes") {
        collection = 'classesModel'
    }
    if (req.query.category === "free") {
        collection = 'freeModel'
    }
    if (req.query.category === "garagesale") {
        collection = 'garageSaleModel'
    }

    if (req.query.category === "jobs") {
        collection = 'jobsModel'
    }
    if (req.query.category === "lostandfound") {
        collection = 'lostandfoundModel'
    }

    mongoose.model(collection)
        .updateOne(
            { '_id': req.query.postid },
            { $pull: { links: req.query.link } }
        )
        .then(() => {
            const { bucket, key } = AmazonS3URI(req.query.link)
            s3.deleteObjects({
                Bucket: bucket,
                Delete: {
                    Objects: [{
                        Key: key
                    }]
                }

            }, function (err, data) {
                if (err) console.log(err);
                else console.log(data);
            })
        })
        .then(() => res.json('Photo deleted'))
        .catch(err => {
            res.status(404).json(err)

        })


})




router.delete("/deletepost", passport.authenticate('jwt', { session: false }), (req, res) => {

    console.log('delete post called automaticlay')

    let collection;

    if (req.query.category === "forsale") {
        collection = 'forSaleModel'
    }
    if (req.query.category === "housing") {
        collection = 'housingModel'
    }

    if (req.query.category === "volunteers") {
        collection = 'volunteersModel'
    }
    if (req.query.category === "services") {
        collection = 'servicesModel'
    }
    if (req.query.category === "events") {
        collection = 'eventsModel'
    }
    if (req.query.category === "classes") {
        collection = 'classesModel'
    }
    if (req.query.category === "free") {
        collection = 'freeModel'
    }
    if (req.query.category === "garagesale") {
        collection = 'garageSaleModel'
    }

    if (req.query.category === "jobs") {
        collection = 'jobsModel'
    }
    if (req.query.category === "lostandfound") {
        collection = 'lostandfoundModel'
    }

    mongoose.model(collection).findOneAndDelete({ _id: req.query.postid })
        .then(post => {
            if (post.links && post.links.length > 0) {
                for (i = 0; i < post.links.length; i++) {
                    const uri = post.links[i]
                    const { bucket, key } = AmazonS3URI(uri)

                    s3.deleteObjects({
                        Bucket: bucket,
                        Delete: {
                            Objects: [{
                                Key: key
                            }]
                        }

                    }, function (err, data) {
                        if (err) console.log(err);
                        else console.log(data);
                    })
                }
            }
            AllPosts.updateOne(
                { "user": req.query.userid },
                { "$pull": { "posts": { "postid": req.query.postid } } })
                .then(() => {
                    AllPosts.aggregate([
                        { "$match": { "user": ObjectId(req.query.userid) } },
                        { "$unwind": "$posts" },
                        { "$sort": { "posts.date": -1 } }
                    ]).then(posts => {
                        // console.log(posts)
                        res.json(posts);
                    })
                        .catch(err => {

                            res.status(404).json(err)
                        }

                        )
                }).catch(err => console.log(err))


        }
        )
        .catch(err => console.log(err))

})




router.get('/profileposts/:userid', passport.authenticate('jwt', { session: false }), (req, res) => {

    AllPosts.aggregate(
        [

            { $match: { user: ObjectId(req.params.userid) } },
            { $unwind: '$posts' },
            { $sort: { 'posts.date': -1 } }

        ]
    )
        .then(posts => {
            // console.log(posts)
            res.json(posts)
        })
        .catch(err => res.status(404).json({ nopostfound: 'There is no posts' }))


})



module.exports = router


