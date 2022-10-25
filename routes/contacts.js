const express = require('express');
const pool = require('../db/postgresql');
const contacts = express.Router();

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
 *         -type
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
 *           description: email of contact
 *         phone:
 *           type: string
 *           description: content of contact
 *         type:
 *           type: enum ['familiar_person', 'companion', 'friend', 'best_friend']
 *           description: content of contact *
 *       example:
 *         id: 1
 *         age: 33
 *         name: Allen Raymond
 *         email: raypino@vestibul.co.uk
 *         phone: (992) 834-3799
 *         type: familiar_person
 *
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
 *         description: the list of the contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contacts'
 */

contacts.get('/', async (req, res) => {
  pool.query('SELECT * FROM contacts', (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json(results.rows);
  });
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contacts'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacts'
 *       500:
 *         description: Some server error
 */

contacts.post('/', (req, res) => {
  const { name, age, email, phone, type = 'familiar_person' } = req.body;
  pool.query(
    'INSERT INTO contacts(name, age, email, phone, type) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [name, age, email, phone, type],
    (error, results) => {
      if (error) {
        return res.status(500).send(error);
      }

      res.status(201).send(`Contact added with ID: ${results.rows[0].id}`);
    },
  );
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
 *         description: contact by its id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacts'
 *       400:
 *         description: post can not be found
 */

contacts.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM contacts WHERE id = $1', [id], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).json(results.rows[0]);
  });
});

/**
 *
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: updates contact by id
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
 *             $ref: '#/components/schemas/Contacts'
 *     responses:
 *       200:
 *         description: The contact was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacts'
 *       404:
 *         description: contact was not found.
 *       500:
 *         description: Some errors happened.
 *
 */

contacts.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age, email, phone, type } = req.body;
  pool.query(
    'UPDATE contacts SET name = $1, age = $2, email = $3, phone = $4, type = $5 WHERE id = $6',
    [name, age, email, phone, type, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Contact modified with ID: ${id}`);
    },
  );
});

/**
 *
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: updates contact by id
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: contact id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contacts'
 *     responses:
 *       200:
 *         description: The contact was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contacts'
 *       404:
 *         description: contact was not found.
 *       500:
 *         description: Some errors happened.
 *
 */

contacts.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age, email, phone, type } = req.body;
  console.log('patch', name, age, email, phone, type, id);
  pool.query(
    'UPDATE contacts SET name = ?, age = ?, email = ?, phone = ?, type = ? WHERE id = ?',
    [name, age, email, phone, type, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Contact modified with ID: ${id}`);
    },
  );
});

/**
 * @swagger
 *  /contacts/{id}:
 *    delete:
 *      summary: removes contact sfrom array
 *      tags: [Contacts]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: contact id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: The contact was deleted
 *        404:
 *          description: The contact was not found
 *
 */

contacts.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('DELETE FROM contacts WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Contact deleted with ID: ${id}`);
  });
});

module.exports = contacts;
