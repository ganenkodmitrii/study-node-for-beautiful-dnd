const express = require('express');
const bodyParser = require('body-parser');
let data = require('../db/data.json');

const contacts = express.Router();
contacts.use(bodyParser.json()); // to use body object in requests

/**
 * @swagger
 * components:
 *   schemas:
 *     Contacts:
 *       type: object
 *       required:
 *         -name
 *         -age
 *         -email
 *         -phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The Auto-generated id of a contact
 *         age:
 *           type: integer
 *           description: age of contact
 *         name:
 *           type: string
 *           description: name of contact
 *         email:
 *           type: string
 *           descripton: email of contact *
 *         phone:
 *           type: string
 *           descripton: content of contact *
 *       example:
 *         id: 1
 *         age: 33
 *         name: Allen Raymond
 *         email: email
 *         phone: phone
 */

/**
 * @swagger
 *  tags:
 *    name: Contacts
 *    description: list of contacts
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Returns all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: the list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

contacts.get('/', (req, res) => {
  res.send(data);
});

/**
 * @swagger
 * /contacts:
 *   contacts:
 *     summary: Create a new post
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */

contacts.post('/', (req, res) => {
  try {
    const post = {
      id: data.length + 1,
      ...req.body,
    };
    data.push(post);
    res.send(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: gets contacts by id
 *     tags: [Contacts]
 *     parameters:
 *       - in : path
 *         name: id
 *         description: id of post
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: posts by its id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: post can not be found
 */

contacts.get('/:id', (req, res) => {
  console.log('req.params.id', req.params.id);
  const contacts = data.find((contact) => {
    return contact.id === +req.params.id;
  });

  if (!contacts) {
    res.sendStatus(404);
  }

  res.send(contacts);
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: updates posts by id
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         decsription: The post was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: post was not found.
 *       500:
 *         description: Some errors happend.
 *
 */

contacts.put('/:id', (req, res) => {
  try {
    let post = data.find((post) => post.id === +req.params.id);
    post.name = req.body.name;
    post.age = req.body.age;
    post.email = req.body.email;
    post.phone = req.body.phone;

    res.send(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 *  /contacts/{id}:
 *    delete:
 *      summary: removes post from array
 *      tags: [Contacts]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: post id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: The post was deleted
 *        404:
 *          description: The post was not found
 *
 */

contacts.delete('/:id', (req, res) => {
  let post = data.find((post) => post.id === +req.params.id);
  const index = data.indexOf(post);

  if (post) {
    data.splice(index, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = contacts;
