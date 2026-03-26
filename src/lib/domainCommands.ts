import { DomainCommand, CommandType } from '../contracts/commands';
import { logDomainEvent } from './domainLogger';

// Registry of registered handlers for specific command types
const handlers: Record<string, (payload: any) => Promise<void> | void> = {};

export function registerHandler(type: CommandType, handler: (payload: any) => Promise<void> | void) {
    handlers[type] = handler;
}

export async function dispatchDomainCommand<T>(
    type: CommandType, 
    source: string, 
    target: string, 
    payload: T
): Promise<DomainCommand<T>> {
    
    const command: DomainCommand<T> = {
        id: `cmd-${Math.random().toString(36).substring(2, 9)}`,
        type,
        source,
        target,
        payload,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    // 1. Log Command Start to Audit Layer
    logDomainEvent({
        domain: source,
        action: `dispatch_${type.toLowerCase()}`,
        status: 'started',
        payload: { commandId: command.id, targetDomain: target, ...payload as any }
    });

    try {
        const handler = handlers[type];
        if (!handler) {
            throw new Error(`No registered handler for command type: ${type}`);
        }

        command.status = 'executing';
        await handler(payload);
        command.status = 'success';

        // 2. Log Command Success
        logDomainEvent({
            domain: target,
            action: `${type.toLowerCase()}_complete`,
            status: 'success',
            payload: { commandId: command.id, sourceDomain: source }
        });

    } catch (error: any) {
        command.status = 'failed';
        
        // 3. Log Command Error
        logDomainEvent({
            domain: target,
            action: `${type.toLowerCase()}_failed`,
            status: 'failed',
            error: error.message,
            payload: { commandId: command.id, sourceDomain: source }
        });
        
        throw error;
    }

    return command;
}
