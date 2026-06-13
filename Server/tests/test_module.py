import pytest

def test_create_module(client, auth_headers):
    response = client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "User Management", "code": "user_mgmt", "url": "/users"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "User Management"
    assert data["code"] == "user_mgmt"
    assert data["url"] == "/users"
    assert data["is_active"] == True

def test_create_duplicate_module_code(client, auth_headers):
    # Setup - first create one
    client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "User Management", "code": "dup_test"}
    )
    
    # Try to create duplicate
    response = client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "Duplicate", "code": "dup_test"}
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_create_duplicate_module_url(client, auth_headers):
    # Setup - first create one
    client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "User Management", "code": "dup_test1", "url": "/users1"}
    )
    
    # Try to create duplicate
    response = client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "Duplicate", "code": "dup_test", "url": "/users1"}
    )
    assert response.status_code == 400
    assert "Url is already exists" in response.json()["detail"]

def test_create_invalid_parent_module(client, auth_headers):
    response = client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "Invalid Parent", "code": "invalid_parent", "parent_id": 999}
    )
    assert response.status_code == 400
    assert "Parent module with ID '999' does not exist" in response.json()["detail"]

def test_create_parent_module_successfully(client, auth_headers):
    parent = client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "Parent Module", "code": "parent_module"}
    )
    assert parent.status_code == 201
    parent_module_id = parent.json()["id"]
    response = client.post(
        "/api/v1/modules/",
        headers=auth_headers,
        json={"name": "Child Module", "code": "child_module", "parent_id": parent_module_id}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["parent_id"] == parent_module_id
    

def test_list_modules(client, auth_headers):
    response = client.get("/api/v1/modules/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_module_successfully(client, auth_headers):
    # Create module
    create_res = client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Old Name", "code": "old_code"})
    module_id = create_res.json()["id"]
    
    # Update module
    update_res = client.put(f"/api/v1/modules/{module_id}", headers=auth_headers, json={"name": "New Name", "code": "new_code", "url": "/new"})
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["name"] == "New Name"
    assert data["code"] == "new_code"
    assert data["url"] == "/new"

def test_update_module_duplicate_code(client, auth_headers):
    client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Module 1", "code": "mod1"})
    create_res = client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Module 2", "code": "mod2"})
    module_id = create_res.json()["id"]
    
    update_res = client.put(f"/api/v1/modules/{module_id}", headers=auth_headers, json={"code": "mod1"})
    assert update_res.status_code == 400
    assert "already exists" in update_res.json()["detail"]

def test_update_module_duplicate_url(client, auth_headers):
    client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Module 3", "code": "mod3", "url": "/url1"})
    create_res = client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Module 4", "code": "mod4", "url": "/url2"})
    module_id = create_res.json()["id"]
    
    update_res = client.put(f"/api/v1/modules/{module_id}", headers=auth_headers, json={"url": "/url1"})
    assert update_res.status_code == 400
    assert "already exists" in update_res.json()["detail"]

def test_update_module_invalid_parent(client, auth_headers):
    create_res = client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Module 5", "code": "mod5"})
    module_id = create_res.json()["id"]
    
    update_res = client.put(f"/api/v1/modules/{module_id}", headers=auth_headers, json={"parent_id": 9999})
    assert update_res.status_code == 400
    assert "does not exist" in update_res.json()["detail"]

def test_update_module_own_parent(client, auth_headers):
    create_res = client.post("/api/v1/modules/", headers=auth_headers, json={"name": "Module 6", "code": "mod6"})
    module_id = create_res.json()["id"]
    
    update_res = client.put(f"/api/v1/modules/{module_id}", headers=auth_headers, json={"parent_id": module_id})
    assert update_res.status_code == 400
    assert "cannot be its own parent" in update_res.json()["detail"]
