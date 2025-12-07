const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all vendors
router.get('/', async (req, res) => {
    try {
        const vendors = await db('vendors').select('*').orderBy('name', 'asc');
        // Parse tags from JSON string
        const parsedVendors = vendors.map(v => ({
            ...v,
            tags: v.tags ? (typeof v.tags === 'string' ? JSON.parse(v.tags) : v.tags) : []
        }));
        res.json(parsedVendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
});

// Create a vendor
router.post('/', async (req, res) => {
    const { name, email, contactPerson, tags } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const [id] = await db('vendors').insert({
            name,
            email,
            contact_person: contactPerson,
            tags: JSON.stringify(tags || [])
        }).returning('id');
        
        const newVendorId = typeof id === 'object' ? id.id : id;

        res.status(201).json({ id: newVendorId, ...req.body });
    } catch (error) {
        if (error.code === '23505') { // Postgres unique constraint violation code
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create vendor' });
    }
});

// Update a vendor
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, contactPerson, tags } = req.body;

    try {
        const count = await db('vendors')
            .where({ id })
            .update({
                name,
                email,
                contact_person: contactPerson,
                tags: JSON.stringify(tags || [])
            });
        
        if (count === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        res.json({ id, ...req.body });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update vendor' });
    }
});

// Delete a vendor
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const count = await db('vendors').where({ id }).del();
        if (count === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        res.json({ message: 'Vendor deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete vendor' });
    }
});

module.exports = router;
