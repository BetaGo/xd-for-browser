export class ListNode<T> {
  constructor(public element: T, public next: ListNode<T> | null = null) {}
}

export class DoublyListNode<T> extends ListNode<T> {
  constructor(
    public element: T,
    public next: DoublyListNode<T> | null = null,
    public prev: DoublyListNode<T> | null = null
  ) {
    super(element, next);
  }
}

export class LinkedList<T> {
  protected count: number = 0;
  protected head: ListNode<T> | null = null;

  get length() {
    return this.count;
  }

  push(element: T) {
    const node = new ListNode(element);
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = node;
    }
    this.count++;
  }

  removeAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current!.next;
      } else {
        const previous = this.getElementAt(index);
        current = previous!.next;
        previous!.next = current!.next;
      }
      this.count--;
      return current?.element ?? null;
    }
    return null;
  }

  getElementAt(index: number) {
    if (index >= 0 && index < this.count) {
      let node = this.head;
      for (let i = 0; i < index && node !== null; i++) {
        node = node.next;
      }
      return node;
    }
    return null;
  }

  insert(element: T, index: number) {
    if (index >= 0 && index <= this.count) {
      const node = new ListNode(element);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getElementAt(index - 1);
        const current = previous!.next;
        node.next = current;
        previous!.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  indexOf(element: T): number {
    let current = this.head;
    for (let i = 0; i < this.count && current !== null; i++) {
      if (element === current.element) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }

  remove(element: T) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  isEmpty() {
    return this.length !== 0;
  }

  getHead() {
    return this.head;
  }
}

export class DoublyLinkedList<T> extends LinkedList<T> {
  head: DoublyListNode<T> | null = null;

  tail: DoublyListNode<T> | null = null;

  getElementAt(index: number): DoublyListNode<T> | null {
    return super.getElementAt(index) as DoublyListNode<T> | null;
  }

  push(element: T) {
    const node = new DoublyListNode(element);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.count++;
  }

  insert(element: T, index: number) {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyListNode(element);
      let current = this.head;
      if (index === 0) {
        if (this.head === null) {
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          current!.prev = node;
          this.head = node;
        }
      } else if (index === this.count) {
        current = this.tail;
        current!.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous!.next;
        node.next = current;
        previous!.next = node;
        current!.prev = node;
        node.prev = previous;
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current!.next;
        if (this.count === 1) {
          this.tail = null;
        } else {
          this.head!.prev = null;
        }
      } else if (index === this.count - 1) {
        current = this.tail;
        this.tail = current!.prev;
        this.tail!.next = null;
      } else {
        current = this.getElementAt(index);
        const previous = current!.prev;
        previous!.next = current!.next;
        current!.next!.prev = previous;
      }
      this.count--;
      return current?.element ?? null;
    }
    return null;
  }
}
