import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from "date-fns"

export const formatDate = (date: string | Date, formatString: string = "MMM dd, yyyy") => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, formatString)
}

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const formatSmartDate = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  if (isToday(dateObj)) {
    return "Today"
  }
  
  if (isYesterday(dateObj)) {
    return "Yesterday"
  }
  
  if (isTomorrow(dateObj)) {
    return "Tomorrow"
  }
  
  return formatDate(dateObj)
}

export const isOverdue = (dueDate: string | Date) => {
  const dateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate
  return dateObj < new Date()
}

export const getDaysUntilDue = (dueDate: string | Date) => {
  const dateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate
  const today = new Date()
  const diffTime = dateObj.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
} 