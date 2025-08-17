/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_849492883")

  // remove field
  collection.fields.removeById("select1801136711")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1801136711",
    "max": null,
    "min": null,
    "name": "granularity_minutes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_849492883")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1801136711",
    "maxSelect": 1,
    "name": "granularity_minutes",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "1",
      "5",
      "10"
    ]
  }))

  // remove field
  collection.fields.removeById("number1801136711")

  return app.save(collection)
})
