routerAdd("POST", "/api/auth/jwt-exchange", function (e) {
  function upsertUser(email) {
    const users = $app.findCollectionByNameOrId("users");
    try {
      return $app.findAuthRecordByEmail("users", email);
    } catch (_) {
      const rec = new Record(users);
      rec.load({
        email: email,
        username: email,
        verified: true,
      });
      $app.save(rec);
      return rec;
    }
  }

  try {
    const request = e.requestInfo();
    const token = request?.body?.token || 'missing-token';
    const claims = $security.parseJWT(token, process.env.LWL_KEY)
    const user = upsertUser(claims.email);
    const meta = { provider: "external-jwt", iss: 'https://login-with.link' };
    return $apis.recordAuthResponse(e, user, "external-jwt", meta); // 200 + JSON

  } catch (err) {
    $app.logger().error("Error parsing JWT:", 'error', err.name, 'token', token);
    throw new BadRequestError("Invalid JWT token");
  }
});
