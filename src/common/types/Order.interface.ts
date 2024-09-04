export type Payment = "stripe-payment" | "momo" | "vnpay" | "COD";

export interface IOrder{
    id: number|string
    user_id?: number|string 
    total_price: string
    note: string
    status_id: number|string
    receiver_name: string
    receiver_email: string
    receiver_phone: string
    receiver_city: string
    receiver_ward: string
    receiver_district: string
    receiver_address: string
    payment_status_id: number|string
    payment_method_id: number|string
    pick_up_required: boolean
    discount_code: string
    discount_price: string
    payment_method: Payment
    sku: string 
}