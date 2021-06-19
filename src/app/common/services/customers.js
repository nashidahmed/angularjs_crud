'use strict';

angular.module('customerApp.services', [])

.service('Customers', ['$http', function($http) {

    // Get all customers from customers.json
    this.getAll = () => {
        return $http.get('data/customers.json')
        .then((response) => {
            let customers = response.data;
            customers.forEach((customer) => {
                customer.created_at = new Date(customer.created_at);
                if(customer.updated_at) {
                    customer.updated_at = new Date(customer.updated_at);
                }
            })
            return customers;
        });
    };

    // Add new customer to the list
    this.add = (newCustomer, customers) => {
        newCustomer.id = customers[customers.length - 1].id + 1;
        newCustomer.created_at = new Date();
        newCustomer.updated_at = null;

        return {
            added: true,
            data: [...customers, newCustomer]
        }
    }

    // Delete an existing customer from the list
    this.delete = (customerToDelete, customers) => {
        return {
            deleted: true,
            data: customers.filter(customer => customer.id !== customerToDelete.id)
        };
    };

}]);