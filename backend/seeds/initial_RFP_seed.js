/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing data
  await knex('proposals').del();
  await knex('rfps').del();
  await knex('vendors').del();

  // Inserting comprehensive vendor data
  const vendors = await knex('vendors').insert([
    {
      name: 'TechPro Solutions',
      email: 'sales@techpro.com',
      contact_person: 'Sarah Johnson',
      tags: JSON.stringify(['hardware', 'electronics', 'IT equipment'])
    },
    {
      name: 'Digital Dynamics Inc',
      email: 'contact@digitaldynamics.com',
      contact_person: 'Michael Chen',
      tags: JSON.stringify(['hardware', 'software', 'enterprise solutions'])
    },
    {
      name: 'Global Tech Suppliers',
      email: 'info@globaltech.com',
      contact_person: 'Emily Rodriguez',
      tags: JSON.stringify(['hardware', 'bulk orders', 'international'])
    },
    {
      name: 'Premium IT Solutions',
      email: 'sales@premiumit.com',
      contact_person: 'David Kumar',
      tags: JSON.stringify(['hardware', 'premium', 'warranty'])
    },
    {
      name: 'Budget Tech Co',
      email: 'orders@budgettech.com',
      contact_person: 'Lisa Wang',
      tags: JSON.stringify(['hardware', 'budget-friendly', 'quick delivery'])
    },
    {
      name: 'Gourmet Catering Services',
      email: 'events@gourmetcatering.com',
      contact_person: 'Chef Antonio',
      tags: JSON.stringify(['catering', 'events', 'premium food'])
    },
    {
      name: 'Party Perfect Catering',
      email: 'info@partyperfect.com',
      contact_person: 'Rachel Green',
      tags: JSON.stringify(['catering', 'events', 'affordable'])
    }
  ]).returning('id');

  // Inserting RFPs with different statuses
  const rfps = await knex('rfps').insert([
    {
      title: 'Enterprise Laptop Procurement - 50 Units',
      description: 'We need 50 high-performance laptops for our engineering team. Requirements include 16GB RAM, 512GB SSD, i7 processor or equivalent, and 3-year warranty.',
      structured_data: JSON.stringify({
        title: 'Enterprise Laptop Procurement - 50 Units',
        summary: 'Procurement of 50 high-performance laptops for engineering team with specific technical requirements.',
        requirements: [
          '16GB RAM minimum',
          '512GB SSD storage',
          'Intel i7 or AMD Ryzen 7 processor',
          '3-year comprehensive warranty',
          'Windows 11 Pro pre-installed',
          'Delivery within 30 days'
        ],
        budget_range: '₹50,000 - ₹80,000 per unit',
        timeline: '1 month'
      }),
      status: 'sent'
    },
    {
      title: 'Annual Holiday Party Catering',
      description: 'Catering services for 200 people for our annual holiday party. Need vegetarian options, dessert station, and beverage service.',
      structured_data: JSON.stringify({
        title: 'Annual Holiday Party Catering',
        summary: 'Full catering service for company holiday party with 200 attendees.',
        requirements: [
          'Vegetarian and non-vegetarian options',
          'Dessert station',
          'Beverage service (alcoholic and non-alcoholic)',
          'Professional serving staff',
          'Setup and cleanup included'
        ],
        budget_range: '₹150,000 - ₹250,000',
        timeline: '2 weeks'
      }),
      status: 'sent'
    },
    {
      title: 'Office Furniture Upgrade',
      description: 'Need ergonomic chairs and standing desks for 30 employees.',
      structured_data: JSON.stringify({
        title: 'Office Furniture Upgrade',
        summary: 'Ergonomic furniture procurement for improved employee comfort.',
        requirements: [
          '30 ergonomic office chairs',
          '15 standing desks',
          'Adjustable height features',
          '5-year warranty'
        ],
        budget_range: '₹300,000 - ₹500,000',
        timeline: '3 weeks'
      }),
      status: 'draft'
    }
  ]).returning('id');
  
  const vendorIds = vendors.map(v => typeof v === 'object' ? v.id : v);
  const rfpIds = rfps.map(r => typeof r === 'object' ? r.id : r);

  // Inserting comprehensive proposals for the first RFP 
  if (rfpIds.length > 0 && vendorIds.length >= 5) {
    await knex('proposals').insert([
      // Proposal 1: TechPro Solutions - Best overall score
      {
        rfp_id: rfpIds[0],
        vendor_id: vendorIds[0],
        content: JSON.stringify({
          total_cost: '₹3,250,000',
          unit_price: '₹65,000',
          quantity: 50,
          delivery_time: '25 days',
          payment_terms: 'Net 45 days',
          warranty: '3 years comprehensive on-site',
          specifications: {
            processor: 'Intel Core i7-13700H',
            ram: '16GB DDR5',
            storage: '512GB NVMe SSD',
            display: '15.6" FHD',
            os: 'Windows 11 Pro'
          },
          compliance_checklist: [
            { requirement: '16GB RAM minimum', met: true },
            { requirement: '512GB SSD storage', met: true },
            { requirement: 'i7 processor', met: true },
            { requirement: '3-year warranty', met: true },
            { requirement: 'Windows 11 Pro', met: true },
            { requirement: 'Delivery within 30 days', met: true }
          ],
          additional_benefits: [
            'Free on-site setup and configuration',
            'Bulk discount of 5%',
            'Extended warranty option available',
            'Dedicated account manager'
          ]
        }),
        price: 3250000.00,
        ai_analysis: JSON.stringify({
          score: 92,
          summary: 'Excellent proposal with competitive pricing and comprehensive warranty. All requirements met with additional value-added services.',
          pros: [
            'Competitive unit price within budget',
            'Fast delivery (25 days)',
            'Comprehensive 3-year on-site warranty',
            'Latest generation processor (13th gen)',
            'Free setup and configuration',
            'Dedicated account manager for ongoing support'
          ],
          cons: [
            'Payment terms slightly longer than some competitors',
            'No mention of backup/replacement units during warranty'
          ],
          technical_fit_score: 95,
          price_competitiveness: 88,
          delivery_score: 92,
          warranty_score: 95
        }),
        score: 92,
        status: 'submitted'
      },

      // Proposal 2: Digital Dynamics Inc - Premium option
      {
        rfp_id: rfpIds[0],
        vendor_id: vendorIds[1],
        content: JSON.stringify({
          total_cost: '₹3,750,000',
          unit_price: '₹75,000',
          quantity: 50,
          delivery_time: '20 days',
          payment_terms: 'Net 30 days',
          warranty: '4 years premium warranty with accidental damage protection',
          specifications: {
            processor: 'Intel Core i7-13800H',
            ram: '32GB DDR5',
            storage: '1TB NVMe SSD',
            display: '15.6" QHD',
            os: 'Windows 11 Pro'
          },
          compliance_checklist: [
            { requirement: '16GB RAM minimum', met: true },
            { requirement: '512GB SSD storage', met: true },
            { requirement: 'i7 processor', met: true },
            { requirement: '3-year warranty', met: true },
            { requirement: 'Windows 11 Pro', met: true },
            { requirement: 'Delivery within 30 days', met: true }
          ],
          additional_benefits: [
            'Upgraded specs (32GB RAM, 1TB SSD)',
            '4-year warranty with accidental damage',
            'Premium support with 4-hour response time',
            '5 spare units included for immediate replacement'
          ]
        }),
        price: 3750000.00,
        ai_analysis: JSON.stringify({
          score: 88,
          summary: 'Premium proposal exceeding all requirements with superior specifications. Higher price point but excellent value for premium features.',
          pros: [
            'Exceeds all technical requirements significantly',
            'Fastest delivery time (20 days)',
            'Extended 4-year warranty with accidental damage',
            'Premium support with quick response',
            'Spare units for zero downtime',
            'Better payment terms (Net 30)'
          ],
          cons: [
            'Higher price - exceeds upper budget limit',
            'May be over-specified for some users',
            'Premium features increase total cost by 15%'
          ],
          technical_fit_score: 98,
          price_competitiveness: 72,
          delivery_score: 95,
          warranty_score: 98
        }),
        score: 88,
        status: 'submitted'
      },

      // Proposal 3: Global Tech Suppliers - Budget option
      {
        rfp_id: rfpIds[0],
        vendor_id: vendorIds[2],
        content: JSON.stringify({
          total_cost: '₹2,750,000',
          unit_price: '₹55,000',
          quantity: 50,
          delivery_time: '35 days',
          payment_terms: 'Net 60 days',
          warranty: '3 years standard warranty',
          specifications: {
            processor: 'Intel Core i7-12700H',
            ram: '16GB DDR4',
            storage: '512GB SATA SSD',
            display: '15.6" FHD',
            os: 'Windows 11 Pro'
          },
          compliance_checklist: [
            { requirement: '16GB RAM minimum', met: true },
            { requirement: '512GB SSD storage', met: true },
            { requirement: 'i7 processor', met: true },
            { requirement: '3-year warranty', met: true },
            { requirement: 'Windows 11 Pro', met: true },
            { requirement: 'Delivery within 30 days', met: false }
          ],
          additional_benefits: [
            'Lowest price option',
            'Flexible payment terms',
            'International warranty coverage'
          ]
        }),
        price: 2750000.00,
        ai_analysis: JSON.stringify({
          score: 78,
          summary: 'Budget-friendly option meeting most requirements. Delivery time exceeds requirement but offers significant cost savings.',
          pros: [
            'Most competitive pricing - 15% below budget',
            'All technical requirements met',
            'Flexible payment terms (Net 60)',
            'International warranty coverage',
            'Significant cost savings'
          ],
          cons: [
            'Delivery time exceeds 30-day requirement',
            'Previous generation processor (12th gen)',
            'SATA SSD instead of NVMe (slower)',
            'DDR4 RAM instead of DDR5',
            'No additional services included'
          ],
          technical_fit_score: 82,
          price_competitiveness: 95,
          delivery_score: 65,
          warranty_score: 80
        }),
        score: 78,
        status: 'submitted'
      },

      // Proposal 4: Premium IT Solutions - High-end option
      {
        rfp_id: rfpIds[0],
        vendor_id: vendorIds[3],
        content: JSON.stringify({
          total_cost: '₹3,500,000',
          unit_price: '₹70,000',
          quantity: 50,
          delivery_time: '28 days',
          payment_terms: 'Net 45 days',
          warranty: '5 years comprehensive warranty',
          specifications: {
            processor: 'Intel Core i7-13700H',
            ram: '16GB DDR5 (upgradeable to 64GB)',
            storage: '512GB NVMe SSD + 1TB HDD',
            display: '15.6" FHD IPS',
            os: 'Windows 11 Pro'
          },
          compliance_checklist: [
            { requirement: '16GB RAM minimum', met: true },
            { requirement: '512GB SSD storage', met: true },
            { requirement: 'i7 processor', met: true },
            { requirement: '3-year warranty', met: true },
            { requirement: 'Windows 11 Pro', met: true },
            { requirement: 'Delivery within 30 days', met: true }
          ],
          additional_benefits: [
            '5-year warranty (exceeds requirement)',
            'Additional 1TB HDD for storage',
            'RAM upgradeable to 64GB',
            'Free annual maintenance',
            'Priority support hotline'
          ]
        }),
        price: 3500000.00,
        ai_analysis: JSON.stringify({
          score: 85,
          summary: 'Strong proposal with excellent warranty and upgrade options. Good balance of price and features.',
          pros: [
            'Exceptional 5-year warranty',
            'Upgrade path for future needs',
            'Additional storage included',
            'Free annual maintenance',
            'Within budget range',
            'Priority support included'
          ],
          cons: [
            'Slightly higher than some competitors',
            'Delivery close to deadline',
            'HDD addition may not be needed by all users'
          ],
          technical_fit_score: 90,
          price_competitiveness: 80,
          delivery_score: 88,
          warranty_score: 100
        }),
        score: 85,
        status: 'submitted'
      },

      // Proposal 5: Budget Tech Co - Fast delivery option
      {
        rfp_id: rfpIds[0],
        vendor_id: vendorIds[4],
        content: JSON.stringify({
          total_cost: '₹3,000,000',
          unit_price: '₹60,000',
          quantity: 50,
          delivery_time: '15 days',
          payment_terms: 'Net 30 days',
          warranty: '3 years standard warranty',
          specifications: {
            processor: 'AMD Ryzen 7 6800H',
            ram: '16GB DDR5',
            storage: '512GB NVMe SSD',
            display: '15.6" FHD',
            os: 'Windows 11 Pro'
          },
          compliance_checklist: [
            { requirement: '16GB RAM minimum', met: true },
            { requirement: '512GB SSD storage', met: true },
            { requirement: 'i7 processor', met: true },
            { requirement: '3-year warranty', met: true },
            { requirement: 'Windows 11 Pro', met: true },
            { requirement: 'Delivery within 30 days', met: true }
          ],
          additional_benefits: [
            'Fastest delivery (15 days)',
            'AMD processor - excellent performance',
            'Good payment terms',
            'Stock readily available'
          ]
        }),
        price: 3000000.00,
        ai_analysis: JSON.stringify({
          score: 86,
          summary: 'Excellent value proposition with fastest delivery time. AMD processor provides comparable performance to Intel i7.',
          pros: [
            'Fastest delivery time (15 days)',
            'Competitive pricing',
            'AMD Ryzen 7 - excellent performance/price ratio',
            'Good payment terms (Net 30)',
            'All requirements met',
            'Stock readily available'
          ],
          cons: [
            'AMD instead of Intel (though performance is comparable)',
            'No additional services or benefits',
            'Standard warranty only'
          ],
          technical_fit_score: 88,
          price_competitiveness: 90,
          delivery_score: 100,
          warranty_score: 80
        }),
        score: 86,
        status: 'submitted'
      }
    ]);

    // Inserting proposals for the second RFP (Catering)
    await knex('proposals').insert([
      // Catering Proposal 1: Gourmet Catering Services
      {
        rfp_id: rfpIds[1],
        vendor_id: vendorIds[5],
        content: JSON.stringify({
          total_cost: '₹220,000',
          per_person_cost: '₹1,100',
          guest_count: 200,
          delivery_time: '10 days notice required',
          payment_terms: '50% advance, 50% on event day',
          menu_details: {
            appetizers: ['Bruschetta', 'Spring Rolls', 'Cheese Platter'],
            main_course: ['Grilled Chicken', 'Paneer Tikka Masala', 'Pasta Primavera'],
            desserts: ['Chocolate Fountain', 'Assorted Pastries', 'Ice Cream Bar'],
            beverages: ['Premium Bar', 'Mocktails', 'Fresh Juices']
          },
          compliance_checklist: [
            { requirement: 'Vegetarian options', met: true },
            { requirement: 'Dessert station', met: true },
            { requirement: 'Beverage service', met: true },
            { requirement: 'Professional staff', met: true },
            { requirement: 'Setup and cleanup', met: true }
          ],
          additional_benefits: [
            'Professional chef on-site',
            'Premium tableware and decorations',
            'Event coordinator included',
            'Complimentary tasting session'
          ]
        }),
        price: 220000.00,
        ai_analysis: JSON.stringify({
          score: 90,
          summary: 'Premium catering service with excellent menu variety and professional service. Slightly above budget but offers exceptional quality.',
          pros: [
            'Comprehensive menu with variety',
            'Professional chef on-site',
            'Event coordinator included',
            'Premium presentation',
            'Complimentary tasting',
            'All requirements exceeded'
          ],
          cons: [
            'Slightly above budget range',
            'Requires 50% advance payment',
            'Premium pricing'
          ],
          quality_score: 95,
          price_competitiveness: 82,
          service_score: 95,
          menu_variety_score: 92
        }),
        score: 90,
        status: 'submitted'
      },

      // Catering Proposal 2: Party Perfect Catering
      {
        rfp_id: rfpIds[1],
        vendor_id: vendorIds[6],
        content: JSON.stringify({
          total_cost: '₹180,000',
          per_person_cost: '₹900',
          guest_count: 200,
          delivery_time: '7 days notice required',
          payment_terms: '30% advance, 70% on event day',
          menu_details: {
            appetizers: ['Samosas', 'Pakoras', 'Salad Bar'],
            main_course: ['Butter Chicken', 'Dal Makhani', 'Veg Biryani', 'Naan'],
            desserts: ['Gulab Jamun', 'Cake', 'Fruit Platter'],
            beverages: ['Standard Bar', 'Soft Drinks', 'Tea/Coffee']
          },
          compliance_checklist: [
            { requirement: 'Vegetarian options', met: true },
            { requirement: 'Dessert station', met: true },
            { requirement: 'Beverage service', met: true },
            { requirement: 'Professional staff', met: true },
            { requirement: 'Setup and cleanup', met: true }
          ],
          additional_benefits: [
            'Budget-friendly option',
            'Flexible payment terms',
            'Quick turnaround time',
            'Indian cuisine specialty'
          ]
        }),
        price: 180000.00,
        ai_analysis: JSON.stringify({
          score: 85,
          summary: 'Excellent value for money with good quality Indian cuisine. Well within budget and meets all requirements.',
          pros: [
            'Well within budget',
            'Better payment terms (30% advance)',
            'Quick turnaround (7 days)',
            'Authentic Indian cuisine',
            'All requirements met',
            'Cost-effective solution'
          ],
          cons: [
            'Less variety than premium option',
            'Standard bar instead of premium',
            'No event coordinator',
            'No tasting session offered'
          ],
          quality_score: 85,
          price_competitiveness: 95,
          service_score: 82,
          menu_variety_score: 80
        }),
        score: 85,
        status: 'submitted'
      }
    ]);
  }
};
