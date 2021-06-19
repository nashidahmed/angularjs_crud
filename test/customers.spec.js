'use strict';

describe('Customers Table', () => {
    let Customers, customersList = readJSON('src/assets/data/customers.json');
    let newCustomer = {
        first_name: "Nashid",
        last_name: "Ahmed",
        email: "nashid.ahmed@gmail.com",
        ip: "123.456.213.423",
        latitude: 12.3242234,
        longitude: -32.2323423
    };

    let customerToDelete = {
        "id": 1,
        "email": "jhamilton0@usda.gov",
        "first_name": "Joshua",
        "last_name": "Hamilton",
        "ip": "135.75.95.238",
        "latitude": -27.634171,
        "longitude": -52.273891,
        "created_at": "2015-01-21 03:20:11",
        "updated_at": null
    }

    beforeEach(angular.mock.module('customerApp.services'));

    beforeEach(inject(($injector) => {
        Customers = $injector.get('Customers');
    }));

    it('should exist', () => {
        expect(Customers).toBeDefined();
    });
    
    describe('.getAll()', () => {
        it('should exist', () => {
            expect(Customers.getAll).toBeDefined();
        });

        it('should return all the customers', () => {
            Customers.getAll()
            .then(data => {
                expect(data).toEqual(customersList)
            })
        });
    });

    describe('.add()', () => {
        it('should exist', () => {
            expect(Customers.add).toBeDefined();
        });

        it('should add a customer to the list', () => {
            let newCustomersList = Customers.add(newCustomer, customersList).data;
            
            expect(newCustomersList.length).toEqual(customersList.length + 1);
            expect(newCustomersList).toContain(jasmine.objectContaining(newCustomer))
        });
    });

    describe('.delete()', () => {
        it('should exist', () => {
            expect(Customers.delete).toBeDefined();
        });

        it('should delete a customer from the list', () => {
            let newCustomersList = Customers.delete(customerToDelete, customersList).data;

            expect(newCustomersList.length).toEqual(customersList.length - 1);
            expect(newCustomersList).not.toContain(jasmine.objectContaining(customerToDelete));
        });
    });
});