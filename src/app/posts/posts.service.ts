import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";


@Injectable({providedIn: 'root'})
export class PostsService { 
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http.get<{message: string, posts: any}>('http:localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map((post) => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    }
                });
            }))
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPosts(title: string, content: string) {
        const post: Post = {id: null, title: title, content: content};
        this.http.post<{message: string, postId: number}>('http:localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                const id = responseData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
        
    }

    deletePost(postId: number) {
        this.http.delete('http:localhost:3000/api/posts' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            })
    }
}