export function timestampToDateString(timestamp){
    return new Date(timestamp).toLocaleDateString('cs-CZ')
}