import config from '../config';

export const getUsers = async () => {
    const data = await fetch(`${config.get('api.host')}/admin/users`, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (data.status === 401) {
        return {
            statusCode: 401,
        };
    }

    return data.json();
};

export const updateUser = async (data) => {
    const response = await fetch(`${config.get('api.host')}/admin/users`, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if ([401, 403, 409, 500].includes(response.status)) {
        return {
            statusCode: response.status,
            error: json.error,
            type: json?.type,
        };
    }

    return json;
};

export const addUser = async (data) => {
    const response = await fetch(`${config.get('api.host')}/admin/users`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if ([401, 403, 409, 500].includes(response.status)) {
        return {
            statusCode: response.status,
            error: json.error,
            type: json?.type,
        };
    }

    return json;
};

export const deleteUser = async (data) => {
    const response = await fetch(`${config.get('api.host')}/admin/users`, {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const json = await response.json();

    if ([401, 403, 409, 500].includes(response.status)) {
        return {
            statusCode: response.status,
            error: json.error,
            type: json?.type,
        };
    }

    return json;
};
