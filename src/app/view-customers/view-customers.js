'use strict';

angular.module('customerApp')

.controller('ViewCustomersCtrl', ['$scope', 'Customers', 'ngNotify', function ($scope, Customers, ngNotify) {

    $scope.currentPage = 1;
    $scope.customersPerPage = 10;
    $scope.numPages = 10;
    $scope.maxSize = 10;
    $scope.newCustomer = {};

    // Get all customers from the customer service
    (() => {
        Customers.getAll()
        .then(data => {
            $scope.customers = data;
        });
    })();

    // Add a new customer to the list
    $scope.addCustomer = (newCustomer) => {
        let response = Customers.add(newCustomer, $scope.customers);

        if(response.added) {
            ngNotify.set(newCustomer.first_name + ' ' + newCustomer.last_name + ' has been successfully added', 'success');
            $scope.customers = response.data;
            $scope.currentPage = Math.ceil($scope.customers.length / $scope.customersPerPage);
            
            // reset form
            $scope.newCustomer = {};
            $scope.addNewCustomer = false;
        }
    };

    // Edit an existing customer
    $scope.editCustomer = (customer) => {
        customer.editMode = true;
        customer.showDetails = true;
    };

    // Update an existing customer
    $scope.updateCustomer = (customer) => {
        customer.updated_at = new Date();
        customer.editMode = false;
    };

    // Delete an existing customer
    $scope.deleteCustomer = (customerToDelete) => {
        if(confirm('Are you sure you want to delete ' + customerToDelete.first_name + ' ' + customerToDelete.last_name + '?')) {
            let response = Customers.delete(customerToDelete, $scope.customers);
        
            if(response.deleted) {
                ngNotify.set(customerToDelete.first_name + ' ' + customerToDelete.last_name + ' has been successfully deleted', 'success');
                $scope.customers = response.data;
            }
        }
    };
}]);