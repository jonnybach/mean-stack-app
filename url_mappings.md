| Method | URL               | Action                  |
| ------ | ---               | ------                  |
| GET    | /api/hotels       | Get all/multiple hotels |
| POST   | /api/hotels       | Create new hotels       |
| GET    | /api/hotels/12345 | Get a specific hotel    |
| PUT    | /api/hotels/12345 | Update a specific hotel |
| DELETE | /api/hotels/12345 | Delete a specific hotel |

| GET    | /api/hotels/12345/reviews       | Get all reviews for a specific hotel |
| POST   | /api/hotels/12345/reviews       | Add specific review                  |
| GET    | /api/hotels/12345/reviews/54321 | Get a specific review                |
| PUT    | /api/hotels/12345/reviews/54321 | Update a specific review             |
| DELETE | /api/hotels/12345/reviews/54321 | Remove a specific review             |

Above table demonstrates the best practices for creating a RESTful api