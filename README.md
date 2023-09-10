Autor: Willyan Antunes  
Email: Willyan.dantunes@gmail.com

# Code Documentation

## getAllProperties(filter: PropertyFilter, page: number = 1, perPage: number = 10)

**Description:**  
This method retrieves a list of properties based on a given filter, with optional pagination parameters and caching.

**Parameters:**  
filter (Type: PropertyFilter): An object containing filter criteria for property retrieval.  
page (Type: number, Default: 1): The current page number for pagination.  
perPage (Type: number, Default: 10): The number of items to retrieve per page.

**Returns:** An object with properties, total count, page, and perPage.

## findPropertyById(id: number)

**Description:** This method finds a property by its ID.

**Parameters:**  
id (Type: number): The ID of the property to find.

**Returns:** The found property or throws a NotFoundError if not found.

## createProperty(fields: Omit<DeepPartial<Property>, 'id'>)

**Description:** This method creates a new property.

**Parameters:**  
fields (Type: Omit<DeepPartial<Property>, 'id'>): An object containing property data to be created.

**Returns:** The created property or throws a ValidationError if validation fails.

## updateProperty(id: number, fields: Omit<DeepPartial<Property>, 'id'>)

**Description:** This method updates an existing property by its ID.

**Parameters:**  
id (Type: number): The ID of the property to update.  
fields (Type: Omit<DeepPartial<Property>, 'id'>): An object containing property data to be updated.

**Returns:** The updated property or throws a NotFoundError if the property doesn't exist or a ValidationError if validation fails.

## deleteProperty(id: number)

**Description:** This method deletes a property by its ID.

**Parameters:**  
id (Type: number): The ID of the property to delete.

**Returns:** An object indicating the success of the deletion or throws a NotFoundError if the property doesn't exist.

# Design Decisions

**Validation:** The code uses the class-validator library for input validation. This ensures that data passed to the service methods meets specified criteria before processing.

**Error Handling:** The code includes error handling for different scenarios. Custom error classes like NotFoundError and ValidationError are used to provide meaningful error messages and HTTP status codes.

**Pagination:** Pagination is supported for the getAllProperties method to limit the number of results returned per page. This allows for efficient retrieval of large datasets.

**Caching:** Caching is enabled for the getAllProperties method, which can improve the performance of frequently accessed property listings.

**Repository Pattern:** The code follows the repository pattern, encapsulating database interactions within the propertyRepository. This promotes separation of concerns and maintainability.

**Code Reusability:** The service methods are designed to be reusable and self-contained, making it easier to use them in different parts of the application.

**Error Handling Middleware:** Error handling middleware functions are defined to catch and handle errors in a standardized way, returning appropriate HTTP responses.

**Type Safety:** TypeScript is used throughout the code to enhance type safety and provide better tooling for development.
