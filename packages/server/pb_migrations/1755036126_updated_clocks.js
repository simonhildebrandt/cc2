/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_849492883")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select2475121225",
    "maxSelect": 1,
    "name": "range",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "12",
      "24"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_849492883")

  // remove field
  collection.fields.removeById("select2475121225")

  return app.save(collection)
})
