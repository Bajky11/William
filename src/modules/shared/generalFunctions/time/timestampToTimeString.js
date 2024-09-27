export function timestampToTimeString(timestamp){
    return new Date(timestamp).toLocaleTimeString('cs-CZ', {
        hour: '2-digit', minute: '2-digit'
    })
}