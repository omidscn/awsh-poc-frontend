import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "dd.MM.yyyy", { locale: de });
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "dd.MM.yyyy HH:mm", { locale: de });
}

export function formatRelative(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: de,
  });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
