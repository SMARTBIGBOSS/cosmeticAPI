<a href='https://coveralls.io/github/SMARTBIGBOSS/API-Test-of-cosmeticweb'><img src='https://coveralls.io/repos/github/SMARTBIGBOSS/API-Test-of-cosmeticweb/badge.svg' alt='Coverage Status' /></a>
# Assignment 1 - API testing and Source Control.

Name: Anqi Li 

## Overview.

The full name of API is Application Programming Interfaces. It is interfaces between the program and the users. Users do not need to read the source code and know how the program run. They interact with the program by APIs. In this program, it allows users to sign up and login as sellers or customers by special APIs. They can also use APIs which are designed by developer to view and update information including account information, cosmetic information and transaction information. The purpose of these APIs is to provide a easy and clear way for users to use this program. Besides, using API is a good way to encapsulate code. 

## API endpoints.

 + GET /cosmetics - Get all cosmetics.
 + GET /cosmetics - Get all cosmetics by fuzzy search.
 + GET /cosmetics/:name - Get all cosmetics by name.
 + GET /cosmetics/:name/:brand - Get all cosmetics by name and brand.
 + GET /cosmetics/sortByLowPrice - Sort all cosmetics by low price.
 + GET /cosmetics/sortByHighPrice - Sort all cosmetics by high price.
 + PUT /cosmetics/:publisher/:id/edit - Edit cosmetic's information.
 + POST /cosmetics/:publisher/add - Add a new cosmetic.
 + DELETE /cosmetics/:publisher/:cosmeticId/delete - Delete a cosmetic.
 + GET /customer/:customerId - Get a spacial customer by Id.
 + PUT /customer/:id/edit - Edit customer's information.
 + POST /customer/signUp - Add a new customer.
 + POST /customer/login - Customer login.
 + GET /sellers - Get all sellers.
 + GET /seller/:sellerId - Get a special seller by Id.
 + POST /seller/login - Seller login.
 + POST /seller/signUp - Add a new seller.
 + POST /seller/:sellerId/edit - Edit seller's information.
 + PUT /transaction/:id/order - Change status to paid.
 + PUT /transaction/:id/delivery - Change status to delivering.
 + PUT /transaction/:id/confirmReceipt - Change status to finished.
 + GET /transactions/countSales - Count all cosmetic's sales.
 + POST /customer/:id/uploadLogo - Upload customer's logo to local folder.
 + POST /seller/:id/uploadLogo - Upload seller's logo to local folder.

## Data storage.

let CosmeticsSchema = new mongoose.Schema({
    cosmeticId: {
        type: String,
        unique: true
    },
    name: {
        type:String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    release_date: Date,
},
    {collection: 'cosmetics'});
	
let CustomersSchema = new mongoose.Schema({
	customerId: {
		type: String
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		match:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	phoneNum: String,
	address: String,
	register_date: Date,
},
	{collection: 'customers'});

let SellersSchema = new mongoose.Schema({
	sellerId: {
		type: String,
		// required: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		match:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	description: String,
	register_date: Date,
},
	{collection: 'sellers'});

let TransactionsSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true
    },
    cosmeId: {
        type: String,
        required: true
    },
    buyerId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    },
    shipping_address: {
        type: String,
        required: true
    },
    contact_Num: {
        type: Number,
        required: true
    },
    last_date: Date,
    status:{ type: String,
        enum: ['unpaid', 'paid', 'delivering', 'finished']}
},
    {collection: 'transactions'});
	
let UserImagesSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    }
},
    {collection: 'user_images'});
	
	

## Sample Test execution.

		$ npm run test_cosmetic

		> cosmeticweb@0.0.0 test_cosmetic F:\Agile Software Practice\cosmeticweb
		> set NODE_ENV=test && mocha test/routes/cosmetics-test.js



		(node:16092) DeprecationWarning: current URL string parser is deprecated, and wi
		ll be removed in a future version. To use the new parser, pass option { useNewUr
		lParser: true } to MongoClient.connect.
		  Cosmetics
		Cosmetic insert success.
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		(node:16092) DeprecationWarning: collection.ensureIndex is deprecated. Use creat
		eIndexes instead.
		Connection success!
			Get /cosmetics
			  √ should return all cosmetics (160ms)
			Get /cosmetics
			  √ should return all cosmetics using fuzzy search (70ms)
			Get /cosmetics/:name
			  √ should return special cosmetics by cosmetic name (191ms)
			Get /cosmetics/:name/:brand
			  √ should return special cosmetics by brand (60ms)
			Get /cosmetics/sortByLowPrice
			  √ should return cosmetics sorted by low price (60ms)
			Get /cosmetics/sortByHighPrice
			  √ should return cosmetics sorted by high price (50ms)
			Put /cosmetics/:publisher/:id/edit
			  Invalid edit
				Boundary test
				  √ No name - should return a validation message (200ms)
				  √ No brand - should return a validation message
				  √ No price - should return a validation message
				No token
				  √ should return a 401 status
			  Valid edit
				√ should return a edit successful message (70ms)
			Post /cosmetics/:publisher/add
			  √ should add a cosmetic and return a message (60ms)
			  √ should return 401 status
			Delete /cosmetics/:publisher/:cosmeticId/delete
		(node:16092) DeprecationWarning: collection.findAndModify is deprecated. Use fin
		dOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
			  √ should remove a cosmetic and return a message (70ms)


		  14 passing (2s)


		$ npm run test_customer

		> cosmeticweb@0.0.0 test_customer F:\Agile Software Practice\cosmeticweb
		> set NODE_ENV=test && mocha test/routes/customers-test.js



		(node:10944) DeprecationWarning: current URL string parser is deprecated, and wi
		ll be removed in a future version. To use the new parser, pass option { useNewUr
		lParser: true } to MongoClient.connect.
		  Customers
		Customer insert success.
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		(node:10944) DeprecationWarning: collection.ensureIndex is deprecated. Use creat
		eIndexes instead.
		Connection success!
			GET /customer/:customerId
			  √ should return a special customer in a object (190ms)
			  √ should return 401 status
			  √ should return a error massage (60ms)
			Put /customer/:id/edit
			  Invalid edit
				√ should return a validation message (1170ms)
				√ should return a 401 status
			  Valid edit
				√ should return a message and update a customer (1143ms)
			Post /customer/signUp
			  Invalid sign up
				Name boundary test
				  √ No Name - should return a sign up unsuccessful message (1121ms)
				  √ Replicate Name - should return a sign up unsuccessful message (1159
		ms)
				Email boundary test
				  √ No Email - should return a sign up unsuccessful message (1133ms)
				  √ Replicate Email - should return a sign up unsuccessful message (114
		4ms)
				  √ Wrong Format - should return a sign up unsuccessful message (1114ms
		)
			  Valid sign up
				√ should return a message and create a new customer (1112ms)
			Post /customer/login
			  √ should return a message and create a new seller (1143ms)
			  √ should return an input incorrect message (1130ms)
			  √ should return a login unsuccessful message (50ms)


		  15 passing (13s)


		$ npm run test_seller

		> cosmeticweb@0.0.0 test_seller F:\Agile Software Practice\cosmeticweb
		> set NODE_ENV=test && mocha test/routes/sellers-test.js



		(node:4356) DeprecationWarning: current URL string parser is deprecated, and wil
		l be removed in a future version. To use the new parser, pass option { useNewUrl
		Parser: true } to MongoClient.connect.
		  Sellers
		Seller insert success.
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		(node:4356) DeprecationWarning: collection.ensureIndex is deprecated. Use create
		Indexes instead.
		Connection success!
			GET /sellers
			  √ should return all the sellers in an array (140ms)
			GET /seller/:sellerId
			  √ should return a special seller in a object (70ms)
			  √ should return 401 status
			  √ should return a error massage (150ms)
			Post /seller/login
			  √ should return a message and create a new seller (1154ms)
			  √ should return an input incorrect message (1114ms)
			  √ should return a login unsuccessful message (40ms)
			Post /seller/signUp
			  Invalid sign up
				√ should return a sign up unsuccessful message (1095ms)
			  valid sign up
				√ should return a message and create a new seller (1193ms)
			Put /seller/:sellerId/edit
			  Invalid edit
				√ should return a validation message (1092ms)
				√ should return a 401 status
			  Valid edit
				√ should return a message and update a seller (1132ms)


		  12 passing (8s)


		$ npm run test_transaction

		> cosmeticweb@0.0.0 test_transaction F:\Agile Software Practice\cosmeticweb
		> set NODE_ENV=test && mocha test/routes/transactions-test.js



		(node:16480) DeprecationWarning: current URL string parser is deprecated, and wi
		ll be removed in a future version. To use the new parser, pass option { useNewUr
		lParser: true } to MongoClient.connect.
		  Transaction
		Transactions insert success.
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		(node:16480) DeprecationWarning: collection.ensureIndex is deprecated. Use creat
		eIndexes instead.
		Connection success!
			Put /transaction/:id/order
		(node:16480) DeprecationWarning: collection.update is deprecated. Use updateOne,
		 updateMany, or bulkWrite instead.
			  √ should change status to paid and return a message (229ms)
			Put /transaction/:id/delivery
			  √ should change status to delivery and return a message (90ms)
			Put /transaction/:id/confirmReceipt
			  √ should change status to finish and return a message (94ms)
			Get /transactions/countSales
			  √ should count total sales of a cosmetic (60ms)


		  4 passing (1s)


		$ npm run test_user_image

		> cosmeticweb@0.0.0 test_user_image F:\Agile Software Practice\cosmeticweb
		> set NODE_ENV=test && mocha test/routes/user_images-test.js



		(node:12264) DeprecationWarning: current URL string parser is deprecated, and wi
		ll be removed in a future version. To use the new parser, pass option { useNewUr
		lParser: true } to MongoClient.connect.
		  user_images
			Post /seller/:id/uploadLogo
			  √ should upload a seller and return a massage (249ms)
			Post /customer/:id/uploadLogo
			  √ should upload a customer and return a massage (112ms)
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		Successfully Connected to [ testcosmeticweb ]
		(node:12264) DeprecationWarning: collection.ensureIndex is deprecated. Use creat
		eIndexes instead.
		Image Exist

		(node:12264) [DEP0013] DeprecationWarning: Calling an asynchronous function with
		out callback is deprecated.

		  2 passing (552ms)



## Extra features.

It has boundary case in customer test file and cosmetic test file. It also tested token as authentication. This test connect to mLab.
