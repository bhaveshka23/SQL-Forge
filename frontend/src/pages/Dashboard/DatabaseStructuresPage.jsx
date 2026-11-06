import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'


const EMPLOYEES_DATABASE = {
  id: 'employees_db',
  name: 'Employees & Company Database',
  shortName: 'Employees Database',
  
  engine: 'MySQL 8.4 LTS',
  collation: 'utf8mb4_unicode_ci',
  totalTables: 13,
  tables: [
    {
      id: 'departments',
      name: 'departments',
      domain: 'HR & ORG',
      rowCount: 8,
      description: 'Departmental units, office locations, and allocated annual operational budgets.',
      columns: [
        { name: 'department_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Primary key for department' },
        { name: 'department_name', type: 'VARCHAR(100)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'Unique department name' },
        { name: 'location', type: 'VARCHAR(100)', key: '', null: 'YES', default: 'NULL', desc: 'Physical office or branch location' },
        { name: 'manager_id', type: 'INT', key: 'MUL', null: 'YES', default: 'NULL', desc: 'Employee ID of the department head' },
        { name: 'budget', type: 'DECIMAL(12,2)', key: '', null: 'NO', default: '0.00', desc: 'Annual operational budget in USD' },
      ],
      relationships: [
        { column: 'manager_id', references: 'employees(employee_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { department_id: 1, department_name: 'Core Infrastructure', location: 'San Francisco, CA', manager_id: 101, budget: '$1,250,000.00' },
        { department_id: 2, department_name: 'Product Engineering', location: 'New York, NY', manager_id: 102, budget: '$2,400,000.00' },
        { department_id: 3, department_name: 'Customer Success', location: 'Austin, TX', manager_id: 104, budget: '$850,000.00' },
        { department_id: 4, department_name: 'Supply & Procurement', location: 'Chicago, IL', manager_id: 106, budget: '$620,000.00' },
      ],
    },
    {
      id: 'employees',
      name: 'employees',
      domain: 'HR & ORG',
      rowCount: 45,
      columns: [
        { name: 'employee_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Unique employee ID' },
        { name: 'first_name', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'First given name' },
        { name: 'last_name', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'Family surname' },
        { name: 'email', type: 'VARCHAR(100)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'Corporate email address' },
        { name: 'phone_number', type: 'VARCHAR(20)', key: '', null: 'YES', default: 'NULL', desc: 'Contact phone number' },
        { name: 'hire_date', type: 'DATE', key: '', null: 'NO', default: 'CURRENT_DATE', desc: 'Date of joining organization' },
        { name: 'job_title', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'Current professional role' },
        { name: 'salary', type: 'DECIMAL(10,2)', key: '', null: 'NO', default: 'NULL', desc: 'Annual base salary' },
        { name: 'department_id', type: 'INT', key: 'MUL', null: 'YES', default: 'NULL', desc: 'Assigned department ID' },
        { name: 'manager_id', type: 'INT', key: 'MUL', null: 'YES', default: 'NULL', desc: 'Direct manager employee ID' },
      ],
      relationships: [
        { column: 'department_id', references: 'departments(department_id)', type: 'Foreign Key' },
        { column: 'manager_id', references: 'employees(employee_id)', type: 'Self Reference FK' },
      ],
      sampleData: [
        { employee_id: 101, first_name: 'Elena', last_name: 'Vance', email: 'elena.vance@sqlnest.io', job_title: 'VP of Infrastructure', salary: '$195,000.00', department_id: 1, manager_id: 'NULL' },
        { employee_id: 102, first_name: 'Marcus', last_name: 'Chen', email: 'marcus.chen@sqlnest.io', job_title: 'Staff Architect', salary: '$182,000.00', department_id: 2, manager_id: 101 },
        { employee_id: 103, first_name: 'Tariq', last_name: 'Al-Mansoor', email: 'tariq.m@sqlnest.io', job_title: 'Senior DB Engineer', salary: '$178,000.00', department_id: 1, manager_id: 101 },
        { employee_id: 104, first_name: 'Aria', last_name: 'Thorne', email: 'aria.thorne@sqlnest.io', job_title: 'Head of Success', salary: '$165,000.00', department_id: 3, manager_id: 101 },
      ],
    },
    {
      id: 'customers',
      name: 'customers',
      domain: 'COMMERCE & ORDERS',
      rowCount: 120,
     
      columns: [
        { name: 'customer_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Primary identifier for customer' },
        { name: 'first_name', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'Customer first name' },
        { name: 'last_name', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'Customer last name' },
        { name: 'email', type: 'VARCHAR(100)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'Customer email address' },
        { name: 'phone', type: 'VARCHAR(20)', key: '', null: 'YES', default: 'NULL', desc: 'Customer primary phone' },
        { name: 'city', type: 'VARCHAR(50)', key: '', null: 'YES', default: 'NULL', desc: 'Billing / Shipping City' },
        { name: 'country', type: 'VARCHAR(50)', key: '', null: 'NO', default: "'USA'", desc: 'Country code or name' },
        { name: 'created_at', type: 'TIMESTAMP', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Account registration date' },
      ],
      relationships: [
        { column: 'customer_id', references: 'Used in orders(customer_id) & reviews(customer_id)', type: 'Parent Key' },
      ],
      sampleData: [
        { customer_id: 501, first_name: 'Liam', last_name: 'Harper', email: 'l.harper@quantum.dev', city: 'Seattle', country: 'USA', created_at: '2026-01-14 10:22:15' },
        { customer_id: 502, first_name: 'Sophia', last_name: 'Rossi', email: 's.rossi@milanotech.eu', city: 'Milan', country: 'Italy', created_at: '2026-02-03 14:18:40' },
        { customer_id: 503, first_name: 'Kenji', last_name: 'Sato', email: 'kenji.sato@tokyo-lab.jp', city: 'Tokyo', country: 'Japan', created_at: '2026-02-18 09:45:00' },
      ],
    },
    {
      id: 'categories',
      name: 'categories',
      domain: 'CATALOG & INVENTORY',
      rowCount: 6,
      
      columns: [
        { name: 'category_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Unique category identifier' },
        { name: 'category_name', type: 'VARCHAR(50)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'Category label' },
        { name: 'description', type: 'TEXT', key: '', null: 'YES', default: 'NULL', desc: 'Detailed description of merchandise' },
      ],
      relationships: [
        { column: 'category_id', references: 'Used in products(category_id)', type: 'Parent Key' },
      ],
      sampleData: [
        { category_id: 1, category_name: 'Database Hardware', description: 'Rackmount server nodes, NVMe arrays, and storage appliances.' },
        { category_id: 2, category_name: 'Network Switches', description: '100GbE fiber optics, top-of-rack switches, and interconnect cables.' },
        { category_id: 3, category_name: 'Developer Licenses', description: 'Enterprise seats for SQLForge IDE, query engines, and toolkits.' },
      ],
    },
    {
      id: 'suppliers',
      name: 'suppliers',
      domain: 'CATALOG & INVENTORY',
      rowCount: 12,
      
      columns: [
        { name: 'supplier_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Primary key for supplier' },
        { name: 'company_name', type: 'VARCHAR(100)', key: '', null: 'NO', default: 'NULL', desc: 'Vendor corporate entity name' },
        { name: 'contact_name', type: 'VARCHAR(100)', key: '', null: 'YES', default: 'NULL', desc: 'Primary account liaison' },
        { name: 'contact_email', type: 'VARCHAR(100)', key: '', null: 'YES', default: 'NULL', desc: 'Direct corporate email' },
        { name: 'phone', type: 'VARCHAR(20)', key: '', null: 'YES', default: 'NULL', desc: 'Support hotline' },
        { name: 'country', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'Headquarters jurisdiction' },
      ],
      relationships: [
        { column: 'supplier_id', references: 'Used in product_suppliers(supplier_id)', type: 'Parent Key' },
      ],
      sampleData: [
        { supplier_id: 10, company_name: 'Apex Silicon Tech', contact_name: 'David Vance', contact_email: 'sales@apexsilicon.com', country: 'Taiwan' },
        { supplier_id: 11, company_name: 'Nordic Optics AS', contact_name: 'Ingrid Berg', contact_email: 'nordic@optics.no', country: 'Norway' },
        { supplier_id: 12, company_name: 'Caliber Server Systems', contact_name: 'Robert Diaz', contact_email: 'robert@caliberservers.com', country: 'USA' },
      ],
    },
    {
      id: 'products',
      name: 'products',
      domain: 'CATALOG & INVENTORY',
      rowCount: 32,
     
      columns: [
        { name: 'product_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Product primary identifier' },
        { name: 'product_name', type: 'VARCHAR(100)', key: '', null: 'NO', default: 'NULL', desc: 'Display product title' },
        { name: 'category_id', type: 'INT', key: 'MUL', null: 'YES', default: 'NULL', desc: 'Foreign key to categories' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', key: '', null: 'NO', default: '0.00', desc: 'Standard retail price per unit' },
        { name: 'units_in_stock', type: 'INT', key: '', null: 'NO', default: '0', desc: 'Live quantity available in warehouse' },
        { name: 'status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'ACTIVE'", desc: 'ACTIVE, DISCONTINUED, BACKORDER' },
      ],
      relationships: [
        { column: 'category_id', references: 'categories(category_id)', type: 'Foreign Key' },
        { column: 'product_id', references: 'Used in order_items, reviews, product_suppliers', type: 'Parent Key' },
      ],
      sampleData: [
        { product_id: 1001, product_name: 'ForgeNode X1 Enterprise Server', category_id: 1, unit_price: '$4,850.00', units_in_stock: 18, status: 'ACTIVE' },
        { product_id: 1002, product_name: 'UltraNVMe 8TB Storage Module', category_id: 1, unit_price: '$920.00', units_in_stock: 45, status: 'ACTIVE' },
        { product_id: 1003, product_name: 'OpticLink 100G Switch 24-Port', category_id: 2, unit_price: '$2,300.00', units_in_stock: 12, status: 'ACTIVE' },
      ],
    },
    {
      id: 'product_suppliers',
      name: 'product_suppliers',
      domain: 'CATALOG & INVENTORY',
      rowCount: 48,
     
      columns: [
        { name: 'product_id', type: 'INT', key: 'PRI', null: 'NO', default: 'NULL', desc: 'Composite PK & FK to products' },
        { name: 'supplier_id', type: 'INT', key: 'PRI', null: 'NO', default: 'NULL', desc: 'Composite PK & FK to suppliers' },
        { name: 'supply_price', type: 'DECIMAL(10,2)', key: '', null: 'NO', default: '0.00', desc: 'Wholesale acquisition cost' },
        { name: 'lead_time_days', type: 'INT', key: '', null: 'NO', default: '7', desc: 'Estimated procurement delay in days' },
      ],
      relationships: [
        { column: 'product_id', references: 'products(product_id)', type: 'Composite FK' },
        { column: 'supplier_id', references: 'suppliers(supplier_id)', type: 'Composite FK' },
      ],
      sampleData: [
        { product_id: 1001, supplier_id: 12, supply_price: '$3,400.00', lead_time_days: 14 },
        { product_id: 1002, supplier_id: 10, supply_price: '$610.00', lead_time_days: 7 },
        { product_id: 1003, supplier_id: 11, supply_price: '$1,650.00', lead_time_days: 10 },
      ],
    },
    {
      id: 'orders',
      name: 'orders',
      domain: 'COMMERCE & ORDERS',
      rowCount: 180,
     
      columns: [
        { name: 'order_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Unique order identifier' },
        { name: 'customer_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Purchasing customer FK' },
        { name: 'employee_id', type: 'INT', key: 'MUL', null: 'YES', default: 'NULL', desc: 'Assigned sales rep employee FK' },
        { name: 'order_date', type: 'DATETIME', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Timestamp of checkout' },
        { name: 'total_amount', type: 'DECIMAL(10,2)', key: '', null: 'NO', default: '0.00', desc: 'Sum total including discounts' },
        { name: 'order_status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'COMPLETED'", desc: 'PENDING, PROCESSING, COMPLETED, CANCELLED' },
      ],
      relationships: [
        { column: 'customer_id', references: 'customers(customer_id)', type: 'Foreign Key' },
        { column: 'employee_id', references: 'employees(employee_id)', type: 'Foreign Key' },
        { column: 'order_id', references: 'Used in order_items & payments', type: 'Parent Key' },
      ],
      sampleData: [
        { order_id: 8801, customer_id: 501, employee_id: 104, order_date: '2026-03-01 11:20:00', total_amount: '$5,770.00', order_status: 'COMPLETED' },
        { order_id: 8802, customer_id: 502, employee_id: 102, order_date: '2026-03-02 15:45:10', total_amount: '$2,300.00', order_status: 'COMPLETED' },
        { order_id: 8803, customer_id: 503, employee_id: 104, order_date: '2026-03-03 09:12:44', total_amount: '$920.00', order_status: 'PROCESSING' },
      ],
    },
    {
      id: 'order_items',
      name: 'order_items',
      domain: 'COMMERCE & ORDERS',
      rowCount: 420,
   
      columns: [
        { name: 'order_item_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Line item surrogate key' },
        { name: 'order_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Header order ID' },
        { name: 'product_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Product purchased' },
        { name: 'quantity', type: 'INT', key: '', null: 'NO', default: '1', desc: 'Quantity count of units' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', key: '', null: 'NO', default: 'NULL', desc: 'Effective unit sale price' },
        { name: 'discount', type: 'DECIMAL(4,2)', key: '', null: 'NO', default: '0.00', desc: 'Discount percentage (0.00 - 1.00)' },
      ],
      relationships: [
        { column: 'order_id', references: 'orders(order_id)', type: 'Foreign Key (Cascade)' },
        { column: 'product_id', references: 'products(product_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { order_item_id: 1, order_id: 8801, product_id: 1001, quantity: 1, unit_price: '$4,850.00', discount: '0.00' },
        { order_item_id: 2, order_id: 8801, product_id: 1002, quantity: 1, unit_price: '$920.00', discount: '0.00' },
        { order_item_id: 3, order_id: 8802, product_id: 1003, quantity: 1, unit_price: '$2,300.00', discount: '0.00' },
      ],
    },
    {
      id: 'payments',
      name: 'payments',
      domain: 'COMMERCE & ORDERS',
      rowCount: 180,
      
      columns: [
        { name: 'payment_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Receipt identifier' },
        { name: 'order_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Settled order identifier' },
        { name: 'payment_date', type: 'DATETIME', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Transaction settlement timestamp' },
        { name: 'amount', type: 'DECIMAL(10,2)', key: '', null: 'NO', default: 'NULL', desc: 'Total currency transferred' },
        { name: 'payment_method', type: 'VARCHAR(30)', key: '', null: 'NO', default: "'CREDIT_CARD'", desc: 'CREDIT_CARD, WIRE_TRANSFER, CRYPTO' },
        { name: 'payment_status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'SETTLED'", desc: 'SETTLED, PENDING, REFUNDED' },
      ],
      relationships: [
        { column: 'order_id', references: 'orders(order_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { payment_id: 901, order_id: 8801, payment_date: '2026-03-01 11:22:10', amount: '$5,770.00', payment_method: 'WIRE_TRANSFER', payment_status: 'SETTLED' },
        { payment_id: 902, order_id: 8802, payment_date: '2026-03-02 15:46:00', amount: '$2,300.00', payment_method: 'CREDIT_CARD', payment_status: 'SETTLED' },
        { payment_id: 903, order_id: 8803, payment_date: '2026-03-03 09:15:30', amount: '$920.00', payment_method: 'CREDIT_CARD', payment_status: 'SETTLED' },
      ],
    },
    {
      id: 'reviews',
      name: 'reviews',
      domain: 'COMMERCE & ORDERS',
      rowCount: 96,
    
      columns: [
        { name: 'review_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Review entry ID' },
        { name: 'product_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Target product ID' },
        { name: 'customer_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Authoring customer ID' },
        { name: 'rating', type: 'INT', key: '', null: 'NO', default: '5', desc: '1 to 5 star rating score' },
        { name: 'comment', type: 'TEXT', key: '', null: 'YES', default: 'NULL', desc: 'Written customer feedback' },
        { name: 'created_at', type: 'TIMESTAMP', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Review publication time' },
      ],
      relationships: [
        { column: 'product_id', references: 'products(product_id)', type: 'Foreign Key' },
        { column: 'customer_id', references: 'customers(customer_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { review_id: 1, product_id: 1001, customer_id: 501, rating: 5, comment: 'Phenomenal query throughput on raw workloads. Zero thermal throttling.', created_at: '2026-03-05' },
        { review_id: 2, product_id: 1002, customer_id: 502, rating: 5, comment: 'Sub-millisecond latency on random 4K reads. High quality silicon.', created_at: '2026-03-06' },
      ],
    },
    {
      id: 'projects',
      name: 'projects',
      domain: 'HR & ORG',
      rowCount: 14,
    
      columns: [
        { name: 'project_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Unique project identifier' },
        { name: 'project_name', type: 'VARCHAR(100)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'Initiative title' },
        { name: 'start_date', type: 'DATE', key: '', null: 'NO', default: 'NULL', desc: 'Kickoff milestone date' },
        { name: 'end_date', type: 'DATE', key: '', null: 'YES', default: 'NULL', desc: 'Target completion date' },
        { name: 'budget', type: 'DECIMAL(12,2)', key: '', null: 'NO', default: '0.00', desc: 'Approved financial expenditure' },
        { name: 'status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'ACTIVE'", desc: 'PLANNING, ACTIVE, COMPLETED, ON_HOLD' },
      ],
      relationships: [
        { column: 'project_id', references: 'Used in employee_projects(project_id)', type: 'Parent Key' },
      ],
      sampleData: [
        { project_id: 301, project_name: 'WASM Virtualization Kernel', start_date: '2026-01-10', end_date: '2026-06-30', budget: '$450,000.00', status: 'ACTIVE' },
        { project_id: 302, project_name: 'Distributed Query Optimizer', start_date: '2026-02-01', end_date: '2026-08-15', budget: '$600,000.00', status: 'ACTIVE' },
        { project_id: 303, project_name: 'Multi-Tenant Security Hardening', start_date: '2025-10-01', end_date: '2026-02-28', budget: '$280,000.00', status: 'COMPLETED' },
      ],
    },
    {
      id: 'employee_projects',
      name: 'employee_projects',
      domain: 'HR & ORG',
      rowCount: 54,
    
      columns: [
        { name: 'employee_id', type: 'INT', key: 'PRI', null: 'NO', default: 'NULL', desc: 'Composite PK & FK to employees' },
        { name: 'project_id', type: 'INT', key: 'PRI', null: 'NO', default: 'NULL', desc: 'Composite PK & FK to projects' },
        { name: 'assigned_date', type: 'DATE', key: '', null: 'NO', default: 'CURRENT_DATE', desc: 'Project onboarding date' },
        { name: 'hours_allocated', type: 'INT', key: '', null: 'NO', default: '20', desc: 'Weekly committed engineering hours' },
        { name: 'role', type: 'VARCHAR(50)', key: '', null: 'NO', default: "'Contributor'", desc: 'Tech Lead, Architect, Contributor' },
      ],
      relationships: [
        { column: 'employee_id', references: 'employees(employee_id)', type: 'Composite FK' },
        { column: 'project_id', references: 'projects(project_id)', type: 'Composite FK' },
      ],
      sampleData: [
        { employee_id: 101, project_id: 301, assigned_date: '2026-01-10', hours_allocated: 25, role: 'Lead Architect' },
        { employee_id: 102, project_id: 301, assigned_date: '2026-01-15', hours_allocated: 40, role: 'Principal Engineer' },
        { employee_id: 103, project_id: 302, assigned_date: '2026-02-01', hours_allocated: 35, role: 'Database Optimizer' },
      ],
    },
  ],
}

// =========================================================================
// 2. E-COMMERCE & ANALYTICS DATABASE
// =========================================================================
const ANALYTICS_DATABASE = {
  id: 'analytics_db',
  name: 'E-Commerce & Clickstream Analytics DB',
  shortName: 'E-Commerce Analytics',
 
  
  collation: 'utf8mb4_bin',
  totalTables: 6,
  tables: [
    {
      id: 'web_sessions',
      name: 'web_sessions',
      domain: 'SESSIONS',
      rowCount: 1420,
      description: 'Browsing sessions initiated across mobile and desktop platforms.',
      columns: [
        { name: 'session_id', type: 'VARCHAR(64)', key: 'PRI', null: 'NO', default: 'UUID()', desc: 'Unique session hash' },
        { name: 'user_id', type: 'INT', key: 'MUL', null: 'YES', default: 'NULL', desc: 'Logged-in user reference' },
        { name: 'started_at', type: 'TIMESTAMP', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Session kickoff timestamp' },
        { name: 'ended_at', type: 'TIMESTAMP', key: '', null: 'YES', default: 'NULL', desc: 'Last event timestamp' },
        { name: 'device_type', type: 'VARCHAR(30)', key: '', null: 'NO', default: "'Desktop'", desc: 'Mobile, Desktop, Tablet' },
      ],
      relationships: [
        { column: 'session_id', references: 'Used in page_views(session_id)', type: 'Parent Key' },
      ],
      sampleData: [
        { session_id: 'sess_99a81', user_id: 501, started_at: '2026-03-01 10:00:12', ended_at: '2026-03-01 10:24:45', device_type: 'Desktop' },
        { session_id: 'sess_14b22', user_id: 502, started_at: '2026-03-01 11:15:00', ended_at: '2026-03-01 11:32:10', device_type: 'Mobile' },
      ],
    },
    {
      id: 'page_views',
      name: 'page_views',
      domain: 'TELEMETRY',
      rowCount: 8650,
     
      columns: [
        { name: 'view_id', type: 'BIGINT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'View occurrence ID' },
        { name: 'session_id', type: 'VARCHAR(64)', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Parent session FK' },
        { name: 'url_path', type: 'VARCHAR(255)', key: '', null: 'NO', default: 'NULL', desc: 'Rendered route path' },
        { name: 'duration_ms', type: 'INT', key: '', null: 'NO', default: '0', desc: 'Dwell time in milliseconds' },
      ],
      relationships: [
        { column: 'session_id', references: 'web_sessions(session_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { view_id: 1, session_id: 'sess_99a81', url_path: '/products/hardware', duration_ms: 14200 },
        { view_id: 2, session_id: 'sess_99a81', url_path: '/checkout', duration_ms: 8500 },
      ],
    },
    {
      id: 'events',
      name: 'events',
      domain: 'TELEMETRY',
      rowCount: 12400,
    
      columns: [
        { name: 'event_id', type: 'BIGINT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Unique event entry' },
        { name: 'session_id', type: 'VARCHAR(64)', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Session identifier' },
        { name: 'event_name', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'CLICK_CTA, RUN_QUERY, APPLY_FILTER' },
        { name: 'created_at', type: 'TIMESTAMP', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Trigger timestamp' },
      ],
      relationships: [
        { column: 'session_id', references: 'web_sessions(session_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { event_id: 101, session_id: 'sess_99a81', event_name: 'RUN_QUERY', created_at: '2026-03-01 10:04:12' },
        { event_id: 102, session_id: 'sess_14b22', event_name: 'CLICK_CTA', created_at: '2026-03-01 11:18:22' },
      ],
    },
    {
      id: 'conversion_funnels',
      name: 'conversion_funnels',
      domain: 'CONVERSIONS',
      rowCount: 540,
     
      columns: [
        { name: 'funnel_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Funnel progression ID' },
        { name: 'user_id', type: 'INT', key: '', null: 'NO', default: 'NULL', desc: 'Candidate user' },
        { name: 'step_number', type: 'INT', key: '', null: 'NO', default: '1', desc: 'Stage index (1 to 5)' },
        { name: 'step_name', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'LANDING, PRICING, CHECKOUT, SUCCESS' },
        { name: 'converted', type: 'BOOLEAN', key: '', null: 'NO', default: 'FALSE', desc: 'Whether step was completed' },
      ],
      relationships: [],
      sampleData: [
        { funnel_id: 1, user_id: 501, step_number: 1, step_name: 'LANDING', converted: 'true' },
        { funnel_id: 2, user_id: 501, step_number: 2, step_name: 'CHECKOUT', converted: 'true' },
      ],
    },
    {
      id: 'user_cohorts',
      name: 'user_cohorts',
      domain: 'RETENTION',
      rowCount: 240,
     
      columns: [
        { name: 'cohort_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Cohort group ID' },
        { name: 'cohort_month', type: 'DATE', key: '', null: 'NO', default: 'NULL', desc: 'Calendar month of signup' },
        { name: 'total_signups', type: 'INT', key: '', null: 'NO', default: '0', desc: 'Total accounts created' },
        { name: 'month_1_retained', type: 'DECIMAL(5,2)', key: '', null: 'NO', default: '0.00', desc: 'Percentage active in M+1' },
      ],
      relationships: [],
      sampleData: [
        { cohort_id: 1, cohort_month: '2026-01-01', total_signups: 320, month_1_retained: '88.50%' },
        { cohort_id: 2, cohort_month: '2026-02-01', total_signups: 450, month_1_retained: '91.20%' },
      ],
    },
    {
      id: 'attribution_sources',
      name: 'attribution_sources',
      domain: 'MARKETING',
      rowCount: 18,
    
      columns: [
        { name: 'source_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Channel ID' },
        { name: 'channel_name', type: 'VARCHAR(50)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'GitHub, HackerNews, Organic, Direct' },
        { name: 'cac_usd', type: 'DECIMAL(8,2)', key: '', null: 'NO', default: '0.00', desc: 'Customer acquisition cost' },
      ],
      relationships: [],
      sampleData: [
        { source_id: 1, channel_name: 'Organic Search', cac_usd: '$0.00' },
        { source_id: 2, channel_name: 'Developer Newsletters', cac_usd: '$14.50' },
      ],
    },
  ],
}

// =========================================================================
// 3. FINTECH & PAYMENTS LEDGER DATABASE
// =========================================================================
const FINTECH_DATABASE = {
  id: 'fintech_db',
  name: 'Global Fintech & Payments Ledger DB',
  shortName: 'Fintech Payments DB',
  engine: 'PostgreSQL 16.2',
  collation: 'en_US.UTF-8',
  totalTables: 8,
  tables: [
    {
      id: 'accounts',
      name: 'accounts',
      domain: 'LEDGER',
      rowCount: 850,
      description: 'Depository and operational user bank balances with currency isolations.',
      columns: [
        { name: 'account_id', type: 'BIGINT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Unique account identifier' },
        { name: 'account_number', type: 'VARCHAR(34)', key: 'UNI', null: 'NO', default: 'NULL', desc: 'IBAN or internal account number' },
        { name: 'currency', type: 'VARCHAR(3)', key: '', null: 'NO', default: "'USD'", desc: 'ISO 4217 Currency Code' },
        { name: 'current_balance', type: 'DECIMAL(14,2)', key: '', null: 'NO', default: '0.00', desc: 'Settled balance' },
        { name: 'status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'ACTIVE'", desc: 'ACTIVE, FROZEN, CLOSED' },
      ],
      relationships: [
        { column: 'account_id', references: 'Used in ledger_entries & transactions', type: 'Parent Key' },
      ],
      sampleData: [
        { account_id: 10001, account_number: 'US89FORGE001928471', currency: 'USD', current_balance: '$240,500.00', status: 'ACTIVE' },
        { account_id: 10002, account_number: 'EU44FORGE009918234', currency: 'EUR', current_balance: '€180,200.00', status: 'ACTIVE' },
      ],
    },
    {
      id: 'transactions',
      name: 'transactions',
      domain: 'SETTLEMENTS',
      rowCount: 4200,
     
      columns: [
        { name: 'tx_id', type: 'VARCHAR(64)', key: 'PRI', null: 'NO', default: 'UUID()', desc: 'Unique transaction token' },
        { name: 'source_account_id', type: 'BIGINT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Debit account' },
        { name: 'dest_account_id', type: 'BIGINT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Credit account' },
        { name: 'amount', type: 'DECIMAL(12,2)', key: '', null: 'NO', default: 'NULL', desc: 'Transaction nominal' },
        { name: 'fee', type: 'DECIMAL(8,2)', key: '', null: 'NO', default: '0.00', desc: 'Service fee charged' },
        { name: 'status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'SETTLED'", desc: 'PENDING, SETTLED, FAILED' },
      ],
      relationships: [
        { column: 'source_account_id', references: 'accounts(account_id)', type: 'Foreign Key' },
        { column: 'dest_account_id', references: 'accounts(account_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { tx_id: 'tx_88192a', source_account_id: 10001, dest_account_id: 10002, amount: '$12,500.00', fee: '$2.50', status: 'SETTLED' },
      ],
    },
    {
      id: 'ledger_entries',
      name: 'ledger_entries',
      domain: 'AUDIT',
      rowCount: 8400,
    
      columns: [
        { name: 'entry_id', type: 'BIGINT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Immutable ledger entry ID' },
        { name: 'tx_id', type: 'VARCHAR(64)', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Associated transaction' },
        { name: 'account_id', type: 'BIGINT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Target account' },
        { name: 'entry_type', type: 'VARCHAR(10)', key: '', null: 'NO', default: 'NULL', desc: 'DEBIT or CREDIT' },
        { name: 'amount', type: 'DECIMAL(12,2)', key: '', null: 'NO', default: 'NULL', desc: 'Amount booked' },
      ],
      relationships: [
        { column: 'account_id', references: 'accounts(account_id)', type: 'Foreign Key' },
      ],
      sampleData: [
        { entry_id: 1, tx_id: 'tx_88192a', account_id: 10001, entry_type: 'DEBIT', amount: '$12,500.00' },
        { entry_id: 2, tx_id: 'tx_88192a', account_id: 10002, entry_type: 'CREDIT', amount: '$12,500.00' },
      ],
    },
    {
      id: 'currency_rates',
      name: 'currency_rates',
      domain: 'FX',
      rowCount: 45,
    
      columns: [
        { name: 'rate_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Rate quote ID' },
        { name: 'base_currency', type: 'VARCHAR(3)', key: '', null: 'NO', default: "'USD'", desc: 'Base currency' },
        { name: 'quote_currency', type: 'VARCHAR(3)', key: '', null: 'NO', default: 'NULL', desc: 'Quote currency' },
        { name: 'rate', type: 'DECIMAL(12,6)', key: '', null: 'NO', default: 'NULL', desc: 'Multiplication rate' },
      ],
      relationships: [],
      sampleData: [
        { rate_id: 1, base_currency: 'USD', quote_currency: 'EUR', rate: '0.924100' },
        { rate_id: 2, base_currency: 'USD', quote_currency: 'JPY', rate: '154.210000' },
      ],
    },
    {
      id: 'wallets',
      name: 'wallets',
      domain: 'CRYPTO',
      rowCount: 320,
      
      columns: [
        { name: 'wallet_id', type: 'VARCHAR(64)', key: 'PRI', null: 'NO', default: 'UUID()', desc: 'Public deposit address' },
        { name: 'user_id', type: 'INT', key: '', null: 'NO', default: 'NULL', desc: 'Account holder' },
        { name: 'asset_symbol', type: 'VARCHAR(10)', key: '', null: 'NO', default: "'USDC'", desc: 'BTC, ETH, USDC, SOL' },
        { name: 'balance', type: 'DECIMAL(18,8)', key: '', null: 'NO', default: '0.00000000', desc: 'Crypto token holdings' },
      ],
      relationships: [],
      sampleData: [
        { wallet_id: '0x99a...e41f', user_id: 501, asset_symbol: 'USDC', balance: '18,500.00000000' },
      ],
    },
    {
      id: 'merchants',
      name: 'merchants',
      domain: 'SETTLEMENTS',
      rowCount: 85,
     
      columns: [
        { name: 'merchant_id', type: 'INT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Merchant ID' },
        { name: 'business_name', type: 'VARCHAR(100)', key: '', null: 'NO', default: 'NULL', desc: 'Trading corporate identity' },
        { name: 'payout_schedule', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'DAILY'", desc: 'DAILY, WEEKLY, MONTHLY' },
      ],
      relationships: [],
      sampleData: [
        { merchant_id: 201, business_name: 'CloudForge Systems Inc.', payout_schedule: 'DAILY' },
      ],
    },
    {
      id: 'audit_logs',
      name: 'audit_logs',
      domain: 'AUDIT',
      rowCount: 9800,
    
      columns: [
        { name: 'log_id', type: 'BIGINT', key: 'PRI', null: 'NO', default: 'AUTO_INCREMENT', desc: 'Log sequence index' },
        { name: 'action', type: 'VARCHAR(50)', key: '', null: 'NO', default: 'NULL', desc: 'WITHDRAW, DEPOSIT, FREEZE' },
        { name: 'actor_id', type: 'VARCHAR(64)', key: '', null: 'NO', default: 'NULL', desc: 'Identity performing change' },
        { name: 'timestamp', type: 'TIMESTAMP', key: '', null: 'NO', default: 'CURRENT_TIMESTAMP', desc: 'Event timestamp' },
      ],
      relationships: [],
      sampleData: [
        { log_id: 1, action: 'DEPOSIT_CONFIRMED', actor_id: 'system_cron_01', timestamp: '2026-03-01 12:00:00' },
      ],
    },
    {
      id: 'settlements',
      name: 'settlements',
      domain: 'SETTLEMENTS',
      rowCount: 640,
     
      columns: [
        { name: 'settlement_id', type: 'VARCHAR(64)', key: 'PRI', null: 'NO', default: 'UUID()', desc: 'Payout batch token' },
        { name: 'merchant_id', type: 'INT', key: 'MUL', null: 'NO', default: 'NULL', desc: 'Receiving merchant' },
        { name: 'net_amount', type: 'DECIMAL(12,2)', key: '', null: 'NO', default: 'NULL', desc: 'Payout minus fees' },
        { name: 'status', type: 'VARCHAR(20)', key: '', null: 'NO', default: "'COMPLETED'", desc: 'PROCESSING, COMPLETED' },
      ],
      relationships: [],
      sampleData: [
        { settlement_id: 'stl_44109', merchant_id: 201, net_amount: '$48,220.50', status: 'COMPLETED' },
      ],
    },
  ],
}

const ALL_DATABASES = [EMPLOYEES_DATABASE, ANALYTICS_DATABASE, FINTECH_DATABASE]

function DatabaseStructuresPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Get active database directly from URL query param or localStorage
  const selectedDbId =
    searchParams.get('db') || localStorage.getItem('active_sql_database') || 'employees_db'

  const [activeDatabase, setActiveDatabase] = useState(() => {
    return localStorage.getItem('active_sql_database') || 'employees_db'
  })

  // Selected Table inside the database
  const [selectedTableId, setSelectedTableId] = useState('departments')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDomainFilter, setActiveDomainFilter] = useState('ALL')
  const [activeDetailTab, setActiveDetailTab] = useState('columns')

  const currentDb = useMemo(() => {
    return ALL_DATABASES.find((db) => db.id === selectedDbId) || EMPLOYEES_DATABASE
  }, [selectedDbId])

  // Get unique domain categories for the current database
  const domainFilters = useMemo(() => {
    if (!currentDb.tables) return ['ALL']
    const domains = Array.from(new Set(currentDb.tables.map((t) => t.domain)))
    return ['ALL', ...domains]
  }, [currentDb])

  // Filter tables by domain and search query
  const filteredTables = useMemo(() => {
    if (!currentDb.tables) return []
    return currentDb.tables.filter((table) => {
      const matchesDomain = activeDomainFilter === 'ALL' || table.domain === activeDomainFilter
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        table.name.toLowerCase().includes(query) ||
        table.description.toLowerCase().includes(query) ||
        table.columns.some(
          (c) => c.name.toLowerCase().includes(query) || c.type.toLowerCase().includes(query)
        )
      return matchesDomain && matchesSearch
    })
  }, [currentDb, activeDomainFilter, searchQuery])

  // Get current selected table, falling back to first table if not in currentDb
  const selectedTable = useMemo(() => {
    if (!currentDb.tables || currentDb.tables.length === 0) return null
    return currentDb.tables.find((t) => t.id === selectedTableId) || currentDb.tables[0]
  }, [currentDb, selectedTableId])

  // Action: Switch database view & update URL
  const handleSwitchDb = (dbId) => {
    setSearchParams({ db: dbId })
    const found = ALL_DATABASES.find((d) => d.id === dbId)
    if (found && found.tables.length > 0) {
      setSelectedTableId(found.tables[0].id)
    }
    setActiveDomainFilter('ALL')
    setSearchQuery('')
  }

  // Action: Select this database as the active execution environment
  const handleSelectDatabase = (dbId, dbName) => {
    setActiveDatabase(dbId)
    localStorage.setItem('active_sql_database', dbId)
    toast.success(`Active database switched to: ${dbName}! Ready for queries.`)
  }

  // Copy helper
  const handleCopySQL = (text, label) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  // Generate CREATE TABLE DDL
  const generateDDL = (table) => {
    if (!table) return ''
    const cols = table.columns.map((c) => {
      let line = `  \`${c.name}\` ${c.type}`
      if (c.null === 'NO') line += ' NOT NULL'
      if (c.default !== 'NULL') line += ` DEFAULT ${c.default}`
      if (c.key === 'PRI' && c.type.includes('INT') && c.default === 'AUTO_INCREMENT')
        line += ' AUTO_INCREMENT'
      return line
    })

    const pks = table.columns.filter((c) => c.key === 'PRI').map((c) => `\`${c.name}\``)
    if (pks.length > 0) {
      cols.push(`  PRIMARY KEY (${pks.join(', ')})`)
    }

    if (table.relationships) {
      table.relationships.forEach((rel) => {
        if (rel.references.includes('(')) {
          cols.push(
            `  CONSTRAINT \`fk_${table.name}_${rel.column}\` FOREIGN KEY (\`${rel.column}\`) REFERENCES ${rel.references}`
          )
        }
      })
    }

    return `CREATE TABLE \`${table.name}\` (\n${cols.join(',\n')}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & DATABASE SELECTOR BAR                                     */}
      {/* ========================================================================= */}
      <div className="border border-forge-border bg-forge-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="mt-1 font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold tracking-tight text-forge-text">
              DATABASE STRUCTURES
            </h1>
          </div>

          
        </div>

        {/* Selected Database Overview Card */}
        <div className="mt-6 border-t border-forge-border pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-forge-border bg-forge-surface text-forge-accent">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth="2" d="M4 6c0-1.5 3.5-2.5 8-2.5s8 1 8 2.5-3.5 2.5-8 2.5-8-1-8-2.5z" />
                  <path strokeLinecap="square" strokeWidth="2" d="M4 6v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5V6" />
                  <path strokeLinecap="square" strokeWidth="2" d="M4 12v6c0 1.5 3.5 2.5 8 2.5s8-1 8-2.5v-6" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-['Space_Grotesk'] text-lg font-bold text-forge-text">
                    {currentDb.name}
                  </h2>
                  {activeDatabase === currentDb.id && (
                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-forge-success border border-forge-success/40 bg-forge-success/10 px-2 py-0.5">
                      ✓ SELECTED WORKSPACE
                    </span>
                  )}
                </div>
                <p className="font-['Inter'] text-xs text-forge-muted mt-0.5">
                  {currentDb.description}
                </p>
              </div>
            </div>

            {/* "SELECT THIS DATABASE" Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectDatabase(currentDb.id, currentDb.name)}
                className={`group relative inline-flex items-center gap-2 border px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeDatabase === currentDb.id
                    ? 'border-forge-success bg-forge-success/15 text-forge-success cursor-default'
                    : 'border-forge-accent bg-forge-accent text-[#101114] hover:bg-forge-accent-hover hover:border-forge-accent-hover shadow-xs'
                }`}
              >
                {activeDatabase === currentDb.id ? (
                  <>
                    <span>✓ DATABASE SELECTED</span>
                    <span className="text-[10px] text-forge-success">● ACTIVE</span>
                  </>
                ) : (
                  <>
                    <span>SELECT THIS DATABASE</span>
                    <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                      ↗
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-1 w-1 bg-forge-bg" />
                  </>
                )}
              </button>
            </div>
          </div>

          
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MASTER-DETAIL SPLIT: Table Catalog & Schema Inspector                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Table List Sidebar (4 cols) */}
        <div className="border border-forge-border bg-forge-card lg:col-span-4 overflow-hidden">
          <div className="border-b border-forge-border bg-forge-card-alt px-4 py-3 flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-xs font-semibold uppercase text-forge-text">
              TABLES ({filteredTables.length})
            </span>
            
          </div>

          <div className="max-h-[640px] overflow-y-auto divide-y divide-forge-border/60">
            {filteredTables.map((table) => {
              const isSelected = selectedTable?.id === table.id
              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => {
                    setSelectedTableId(table.id)
                    setActiveDetailTab('columns')
                  }}
                  className={`w-full text-left p-3.5 transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-l-4 border-forge-accent bg-forge-card-alt text-forge-text'
                      : 'border-l-4 border-transparent hover:bg-forge-surface/60 text-forge-muted hover:text-forge-text'
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-['JetBrains_Mono'] text-xs font-bold text-forge-text">
                        {table.name}
                      </span>
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-forge-accent" />
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {filteredTables.length === 0 && (
              <div className="p-8 text-center font-['JetBrains_Mono'] text-xs text-forge-muted">
                NO TABLES FOUND MATCHING "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right: Table Inspector & Tabs (8 cols) */}
        {selectedTable ? (
          <div className="border border-forge-border bg-forge-card lg:col-span-8 overflow-hidden">
            {/* Table Header Bar */}
            <div className="border-b border-forge-border bg-forge-card-alt p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-forge-muted">
                  <span>TABLE: {selectedTable.domain}</span>
                  
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-forge-text mt-0.5 flex items-center gap-2">
                  <span className="text-forge-accent">`</span>
                  <span>{selectedTable.name}</span>
                  <span className="text-forge-accent">`</span>
                </h3>
                
              </div>
            </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-['JetBrains_Mono'] text-xs">
                  <thead>
                    <tr className="border-b border-forge-border bg-forge-card-alt text-[10px] uppercase text-forge-muted">
                      <th className="p-3.5">COLUMN NAME</th>
                      <th className="p-3.5">DATA TYPE</th>
                      <th className="p-3.5">KEY</th>
                      <th className="p-3.5">NULLABLE</th>
                      <th className="p-3.5">DEFAULT</th>
                      <th className="p-3.5">DESCRIPTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forge-border text-forge-text">
                    {selectedTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-forge-card-alt/40 transition-colors">
                        <td className="p-3.5 font-bold text-forge-text flex items-center gap-2">
                          <span>{col.name}</span>
                          {col.key === 'PRI' && (
                            <span className="text-[9px] px-1 bg-forge-accent/20 text-forge-accent border border-forge-accent/40 font-bold">
                              PK
                            </span>
                          )}
                          {col.key === 'MUL' && (
                            <span className="text-[9px] px-1 bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-bold">
                              FK
                            </span>
                          )}
                          {col.key === 'UNI' && (
                            <span className="text-[9px] px-1 bg-forge-success/20 text-forge-success border border-forge-success/40 font-bold">
                              UNI
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-[#38BDF8]">{col.type}</td>
                        <td className="p-3.5 text-forge-muted">{col.key || '-'}</td>
                        <td className="p-3.5">
                          <span
                            className={
                              col.null === 'NO'
                                ? 'text-forge-accent font-semibold'
                                : 'text-forge-muted'
                            }
                          >
                            {col.null}
                          </span>
                        </td>
                        <td className="p-3.5 text-forge-muted">{col.default}</td>
                        <td className="p-3.5 font-['Inter'] text-[11px] text-forge-muted max-w-xs">
                          {col.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        ) : (
          <div className="border border-forge-border bg-forge-card p-12 text-center text-forge-muted font-['JetBrains_Mono'] text-xs lg:col-span-8">
            SELECT A TABLE FROM THE LEFT CATALOG TO INSPECT DETAILS.
          </div>
        )}
      </div>
    </div>
  )
}

export default DatabaseStructuresPage
