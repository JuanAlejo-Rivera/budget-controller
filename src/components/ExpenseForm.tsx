import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState, type ChangeEvent } from "react";
import type { DraftExpense, Value } from "../types";
import Swal from 'sweetalert2'
import { useBudget } from "../hooks/useBudget";
import { toast } from "react-toastify";



export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })
    const [previousamount, setPreviousamount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {

        if (state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviousamount(editingExpense.amount)
        }
    }, [state.editingId])


    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validar campos vacíos o inválidos
        const { expenseName, amount, category } = expense;

        if (!expenseName || amount <= 0 || !category) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Todos los campos son obligatorios y el monto debe ser mayor a cero.'
            });
            return;
        }

        //Validar que no me pase del limite
        //si el valor ingresado - el valor previo es mayor al saldo disponible
        if ((expense.amount - previousamount) > remainingBudget) {
            toast.error('El gasto sobrepasa el presupuesto', {
                position: 'top-right',      // Posición del mensaje
                autoClose: 2000,            // Se cierra en 3 segundos
                progress: undefined         // Deja que se calcule solo
            })
            return
        }

        //agregar o actualizar el gasto
        if (state.editingId) {
            dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })

        } else {
            dispatch({ type: 'add-expense', payload: { expense } })
        }

        //reiniciar el state
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousamount(0)//esta linea es para reiniciar el valor previo cuando se agrega un nuevo gasto y no si se edita uno existente

        toast.success(state.editingId ? 'Gasto editado correctamente' : 'Gasto agregado correctamente', {
            position: 'top-right',      
            autoClose: 2000,           
            progress: undefined         
        })
    }


    return (
        <div>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <legend
                    className="uppercase text-center text-2xl font-black border-b-4 py-2
             border-blue-500"
                >{state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}</legend>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="expenseName"
                        className="text-xl"
                    >Nombre de gasto: </label>
                    <input
                        type="text"
                        id="expenseName"
                        placeholder="Añade el nombre del gasto"
                        className="bg-slate-100 p-2"
                        name="expenseName"
                        value={expense.expenseName}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="amount"
                        className="text-xl"
                    >Cantidad: </label>

                    <input
                        type="text"
                        id="amount"
                        placeholder="Añade la cantidad del gasto ej. 300"
                        className="bg-slate-100 p-2"
                        name="amount"
                        value={expense.amount}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="amount"
                        className="text-xl"
                    >Categoria: </label>

                    <select
                        id="category"
                        className="bg-slate-100 p-2"
                        name="category"
                        value={expense.category}
                        onChange={handleChange}
                    >
                        <option value="">-- Seleccione --</option>
                        {categories.map(category => (
                            <option
                                key={category.id}
                                value={category.id}
                            >{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="amount"
                        className="text-xl"
                    >Fecha gasto: </label>

                    <DatePicker
                        className="bg-slate-100 p-2 border-0"
                        value={expense.date}
                        onChange={handleChangeDate}
                    />
                </div>

                <input
                    type="submit"
                    className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bolt rounded-lg"
                    value={state.editingId ? 'Registrar Cambio' : 'Registrar Gasto'}
                />

            </form>
        </div>
    )
}
