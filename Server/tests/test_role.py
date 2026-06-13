import pytest

def test_create_role_success(client, auth_headers):
    payload = {
        "name": "Super Manager",
        "power_level": 50
    }
    response = client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Super Manager"
    assert data["power_level"] == 50

def test_create_role_missing_name(client, auth_headers):
    payload = {
        "power_level": 50
    }
    response = client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    assert response.status_code == 422

def test_create_role_duplicate_name(client, auth_headers):
    payload = {
        "name": "Duplicate Role",
        "power_level": 10
    }
    client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    response = client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_get_role_by_id_success(client, auth_headers):
    # Create role
    payload = {
        "name": "Guest Role",
        "power_level": 5
    }
    create_res = client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    role_id = create_res.json()["id"]

    # Retrieve role
    get_res = client.get(f"/api/v1/roles/{role_id}", headers=auth_headers)
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["name"] == "Guest Role"
    assert data["power_level"] == 5

def test_get_role_by_id_not_found(client, auth_headers):
    response = client.get("/api/v1/roles/9999", headers=auth_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

def test_list_roles_search_and_sort(client, auth_headers):
    # Create two roles
    client.post("/api/v1/roles/", json={"name": "Alpha Role", "power_level": 1}, headers=auth_headers)
    client.post("/api/v1/roles/", json={"name": "Beta Role", "power_level": 2}, headers=auth_headers)
    
    # List all roles
    response = client.get("/api/v1/roles/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert isinstance(data, list)
    
    # Search
    search_res = client.get("/api/v1/roles/?search=Alpha", headers=auth_headers)
    assert search_res.status_code == 200
    search_data = search_res.json()["data"]
    assert len(search_data) == 1
    assert search_data[0]["name"] == "Alpha Role"
    
    # Sort
    sort_res = client.get("/api/v1/roles/?sort_by=name&sort_order=DESC", headers=auth_headers)
    assert sort_res.status_code == 200
    sort_data = sort_res.json()["data"]
    # Verify descending order
    names = [r["name"] for r in sort_data if r["name"] in ["Alpha Role", "Beta Role"]]
    if names:
        assert names == sorted(names, reverse=True)

def test_update_role_success(client, auth_headers):
    # Create role
    payload = {
        "name": "Temporary Role",
        "power_level": 10
    }
    create_res = client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    role_id = create_res.json()["id"]

    # Update role
    update_payload = {
        "name": "Updated Role Name",
        "power_level": 20
    }
    update_res = client.put(f"/api/v1/roles/{role_id}", json=update_payload, headers=auth_headers)
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["name"] == "Updated Role Name"
    assert data["power_level"] == 20

def test_update_role_duplicate_name(client, auth_headers):
    client.post("/api/v1/roles/", json={"name": "Existing Role", "power_level": 1}, headers=auth_headers)
    create_res = client.post("/api/v1/roles/", json={"name": "Role To Update", "power_level": 1}, headers=auth_headers)
    role_id = create_res.json()["id"]

    update_res = client.put(f"/api/v1/roles/{role_id}", json={"name": "Existing Role"}, headers=auth_headers)
    assert update_res.status_code == 400
    assert "already exists" in update_res.json()["detail"]

def test_update_role_not_found(client, auth_headers):
    update_res = client.put("/api/v1/roles/9999", json={"name": "New Name"}, headers=auth_headers)
    assert update_res.status_code == 404
    assert "not found" in update_res.json()["detail"]

def test_delete_role_success(client, auth_headers):
    payload = {
        "name": "To Be Deleted",
        "power_level": 1
    }
    create_res = client.post("/api/v1/roles/", json=payload, headers=auth_headers)
    role_id = create_res.json()["id"]

    # Delete
    del_res = client.delete(f"/api/v1/roles/{role_id}", headers=auth_headers)
    assert del_res.status_code == 200

    # Ensure get fails
    get_res = client.get(f"/api/v1/roles/{role_id}", headers=auth_headers)
    assert get_res.status_code == 404

def test_delete_role_not_found(client, auth_headers):
    del_res = client.delete("/api/v1/roles/9999", headers=auth_headers)
    assert del_res.status_code == 404
    assert "not found" in del_res.json()["detail"]
