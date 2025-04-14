const API_URL = 'http://localhost:3001/api';

export async function powerAndOutage(frequency, radius, grid, EIRP ) {
    try {
        const data = {
            frequency: parseFloat(frequency),
            radius: parseFloat(radius),
            grid: parseFloat(grid),
            EIRP: parseFloat(EIRP),
        };
        console.log(data);
        const response = await fetch(`${API_URL}/GenerateGraph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return null;
        }
        return result;
    } catch (err) {
        console.error(err);
        alert('Erro ao calcular potência e taxa de outage.');
        return null;
    }
}

export async function addMicrocell(x, y, power) {
    try {
        const data = {
            x: parseFloat(x),
            y: parseFloat(y),
            power: parseFloat(power),
        };
        console.log(data);
        const response = await fetch(`${API_URL}/add_microcelula`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return null;
        }
        return result;
    } catch (err) {
        console.error(err);
        alert('Erro ao adicionar microcélula.');
        return null;
    }
}

export async function deleteMicrocell(x,y) {
    try {
        const data = {
            x: parseFloat(x),
            y: parseFloat(y),
        };
        console.log(data);
        const response = await fetch(`${API_URL}/delete_microcelula`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return null;
        }
        return result;
    } catch (err) {
        console.error(err);
        alert('Erro ao deletar microcélula.');
        return null;
    }
}
export async function deleteAllMicrocells() {
    try {
        const response = await fetch(`${API_URL}/delete_all_microcelula`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();
        if (result.error) {
            alert(result.error);
            return null;
        }
        return result;
    } catch (err) {
        console.error(err);
        alert('Erro ao deletar todas as microcélulas.');
        return null;
    }
}